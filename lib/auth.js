import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "fx_admin";
const WEEK = 7 * 24 * 3600;

export const adminEnabled = () => String(process.env.ADMIN_PASSWORD || "").length >= 8;
const secret = () => process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
const sign = (v) => crypto.createHmac("sha256", secret()).update(v).digest("hex");
const hash = (s) => crypto.createHash("sha256").update(String(s)).digest();

export const checkPassword = (p) => crypto.timingSafeEqual(hash(p), hash(process.env.ADMIN_PASSWORD));

export function makeToken() {
  const v = String(Date.now() + WEEK * 1000);
  return `${v}.${sign(v)}`;
}

function validToken(t) {
  if (!t) return false;
  const [v, sig] = String(t).split(".");
  if (!v || !sig) return false;
  const good = sign(v);
  if (sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return false;
  return Number(v) > Date.now();
}

export async function isAdmin() {
  if (!adminEnabled()) return false;
  return validToken((await cookies()).get(COOKIE)?.value);
}

export const cookieOptions = { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: WEEK };
