import { SHOP, totals, money } from "@/lib/products";
import { getProducts } from "@/lib/db";

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }

  const c = b.customer || {};
  for (const [k, label] of [["name", "your name"], ["phone", "your mobile number"], ["city", "your city"], ["street", "your address"]])
    if (!String(c[k] || "").trim()) return Response.json({ error: `Please enter ${label}.` }, { status: 400 });
  if (!/^(\+?92|0)3\d{9}$/.test(String(c.phone).replace(/[\s-]/g, "")))
    return Response.json({ error: "Please enter a valid Pakistani mobile number, e.g. 0300 1234567." }, { status: 400 });
  if (c.email && !/^\S+@\S+\.\S+$/.test(c.email)) return Response.json({ error: "Invalid email address." }, { status: 400 });
  if (b.consent !== true) return Response.json({ error: "Please accept the terms." }, { status: 400 });

  const PRODUCTS = await getProducts();
  // Prices are always recalculated on the server. Never trust the browser.
  const lines = (b.items || [])
    .map((i) => { const p = PRODUCTS.find((x) => x.id === i.id); return p && i.qty > 0 && i.qty <= 20 ? { ...p, qty: Math.floor(i.qty), size: p.sizes?.includes(i.size) ? i.size : "" } : null; })
    .filter(Boolean);
  if (!lines.length) return Response.json({ error: "Your cart is empty." }, { status: 400 });

  const t = totals(lines);
  const id = "FX-" + Date.now().toString(36).toUpperCase();
  const summary = [
    `Order ${id} (Cash on Delivery)`,
    ...lines.map((l) => `${l.qty} x ${l.name}${l.size ? " (size " + l.size + ")" : ""} - ${money(l.price * l.qty)}`),
    `Delivery: ${t.shipping ? money(t.shipping) : "Free"} | TOTAL: ${money(t.total)}`,
    `${c.name} | ${c.phone}${c.email ? " | " + c.email : ""}`,
    `${c.street}, ${c.city}`,
    c.note ? `Note: ${c.note}` : "",
  ].filter(Boolean).join("\n");

  console.log(summary); // visible in your hosting logs

  if (process.env.RESEND_API_KEY && process.env.ORDER_EMAIL_TO) {
    const send = (to, subject, text) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.ORDER_EMAIL_FROM, to, subject, text }),
      });
    const jobs = [send(process.env.ORDER_EMAIL_TO, `New order ${id}`, summary)];
    if (c.email) jobs.push(send(c.email, `Your ${SHOP.name} order ${id}`, `Thank you for your order! Please pay ${money(t.total)} in cash on delivery.\n\n${summary}`));
    await Promise.allSettled(jobs);
  }
  return Response.json({ id, total: t.total, summary });
}
