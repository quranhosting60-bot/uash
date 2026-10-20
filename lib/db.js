// Storage for the product catalog and uploaded photos.
// Online (Vercel): uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set.
// Local testing: uses the ./data folder.
import fs from "fs/promises";
import path from "path";
import { PRODUCTS as SEED, normalize } from "@/lib/products";

const useBlob = () => !!process.env.BLOB_READ_WRITE_TOKEN;
const DATA = path.join(process.cwd(), "data");
const FILE = path.join(DATA, "products.json");
const CATALOG = "catalog/products.json";

export const storageMode = () => (useBlob() ? "vercel-blob" : "local-files");

export async function getProducts() {
  return normalize(await readProducts());
}

async function readProducts() {
  if (useBlob()) {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: CATALOG });
    const b = blobs.find((x) => x.pathname === CATALOG);
    if (!b) return SEED;
    const r = await fetch(`${b.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!r.ok) throw new Error("Could not read the product catalog");
    return await r.json();
  }
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return SEED;
    throw e;
  }
}

export async function saveProducts(products) {
  const body = JSON.stringify(products, null, 1);
  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    await put(CATALOG, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60 });
    return;
  }
  await fs.mkdir(DATA, { recursive: true });
  await fs.writeFile(FILE, body);
}

export async function saveImage(buffer, id) {
  const name = `${id}-${Date.now()}.jpg`;
  if (useBlob()) {
    const { put } = await import("@vercel/blob");
    const r = await put(`products/${name}`, buffer, { access: "public", addRandomSuffix: false, contentType: "image/jpeg", cacheControlMaxAge: 31536000 });
    return r.url;
  }
  await fs.mkdir(path.join(DATA, "uploads"), { recursive: true });
  await fs.writeFile(path.join(DATA, "uploads", name), buffer);
  return `/api/img/${name}`;
}

export async function removeImage(url) {
  if (!url) return;
  try {
    if (url.startsWith("/api/img/")) await fs.unlink(path.join(DATA, "uploads", path.basename(url)));
    else if (useBlob() && url.includes("blob.vercel-storage.com")) { const { del } = await import("@vercel/blob"); await del(url); }
  } catch {}
}

export async function readLocalImage(name) {
  return fs.readFile(path.join(DATA, "uploads", path.basename(name)));
}
