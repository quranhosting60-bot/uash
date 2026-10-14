import { cookies } from "next/headers";
import { adminEnabled, checkPassword, makeToken, COOKIE, cookieOptions } from "@/lib/auth";

const tries = new Map(); // ip -> { n, until }  (slows down password guessing)

export async function POST(req) {
  if (!adminEnabled()) return Response.json({ error: "Admin is disabled. Set ADMIN_PASSWORD (at least 8 characters)." }, { status: 503 });
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const t = tries.get(ip) || { n: 0, until: 0 };
  if (t.until > Date.now()) return Response.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });

  let body = {};
  try { body = await req.json(); } catch {}
  if (!body.password || !checkPassword(body.password)) {
    t.n += 1;
    if (t.n >= 5) { t.until = Date.now() + 15 * 60 * 1000; t.n = 0; }
    tries.set(ip, t);
    await new Promise((r) => setTimeout(r, 700));
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }
  tries.delete(ip);
  (await cookies()).set(COOKIE, makeToken(), cookieOptions);
  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).set(COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return Response.json({ ok: true });
}
