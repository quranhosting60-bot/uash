import { isAdmin, adminEnabled } from "@/lib/auth";
import { getProducts, saveProducts, saveImage, removeImage, storageMode } from "@/lib/db";
import { SHOP } from "@/lib/products";

export const runtime = "nodejs";
export const maxDuration = 30;

const deny = () =>
  adminEnabled() ? Response.json({ error: "Please log in." }, { status: 401 }) : Response.json({ error: "Admin is disabled." }, { status: 503 });
const bad = (error) => Response.json({ error }, { status: 400 });
const clean = (v, max) => String(v ?? "").trim().slice(0, max);

export async function GET() {
  if (!(await isAdmin())) return deny();
  return Response.json({ products: await getProducts(), storage: storageMode(), categories: SHOP.categories });
}

export async function POST(req) {
  if (!(await isAdmin())) return deny();
  let f;
  try { f = await req.formData(); } catch { return bad("Invalid form."); }

  const name = clean(f.get("name"), 100);
  const category = clean(f.get("category"), 30);
  const sub = clean(f.get("sub"), 30);
  const price = Math.round(Number(f.get("price")));
  const was = f.get("was") ? Math.round(Number(f.get("was"))) : 0;
  const tag = clean(f.get("tag"), 10);
  const desc = clean(f.get("desc"), 600);
  const sizes = clean(f.get("sizes"), 100).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12).map((s) => s.slice(0, 10));

  if (name.length < 2) return bad("Please enter a product name.");
  if (!SHOP.categories.includes(category)) return bad("Please choose a category.");
  if (!(price > 0 && price < 10000000)) return bad("Please enter a valid price.");
  if (was && was <= price) return bad("The old price must be higher than the price.");
  if (!["", "new", "sale"].includes(tag)) return bad("Invalid label.");

  let products;
  try { products = await getProducts(); } catch (e) { return bad("Could not read products: " + e.message); }
  const id = Number(f.get("id")) || 0;
  const old = id ? products.find((p) => p.id === id) : null;
  if (id && !old) return bad("Product not found.");

  let image = old?.image;
  const file = f.get("image");
  if (file && typeof file === "object" && file.size > 0) {
    if (file.size > 4 * 1024 * 1024) return bad("Photo is too large. Maximum 4 MB.");
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return bad("Photo must be JPG, PNG or WebP.");
    let buf = Buffer.from(await file.arrayBuffer());
    try {
      const sharp = (await import("sharp")).default;
      buf = await sharp(buf).rotate().resize({ width: 1000, height: 1400, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, progressive: true }).toBuffer();
    } catch { /* keep the original if resizing is unavailable */ }
    const newId = id || products.reduce((m, p) => Math.max(m, p.id), 0) + 1;
    try { image = await saveImage(buf, newId); } catch (e) { return bad("Could not save the photo: " + e.message); }
    if (old?.image) await removeImage(old.image);
  }

  const item = { id: old?.id || products.reduce((m, p) => Math.max(m, p.id), 0) + 1, name, category, sub, price, ...(was ? { was } : {}), ...(tag ? { tag } : {}), ...(sizes.length ? { sizes } : {}), desc, ...(image ? { image } : {}) };
  const next = old ? products.map((p) => (p.id === old.id ? item : p)) : [...products, item];
  try { await saveProducts(next); } catch (e) { return bad("Could not save: " + e.message); }
  return Response.json({ ok: true, product: item });
}

export async function DELETE(req) {
  if (!(await isAdmin())) return deny();
  const id = Number(new URL(req.url).searchParams.get("id"));
  const products = await getProducts();
  const p = products.find((x) => x.id === id);
  if (!p) return bad("Product not found.");
  try { await saveProducts(products.filter((x) => x.id !== id)); } catch (e) { return bad("Could not save: " + e.message); }
  await removeImage(p.image);
  return Response.json({ ok: true });
}
