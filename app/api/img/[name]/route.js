import { readLocalImage } from "@/lib/db";

// Serves photos uploaded while testing locally (online, photos come from Vercel Blob).
export async function GET(_req, { params }) {
  try {
    const { name } = await params;
    const buf = await readLocalImage(name);
    return new Response(buf, { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
