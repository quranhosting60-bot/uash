import Link from "next/link";
import { notFound } from "next/navigation";

// TEMPLATE TEXT ONLY. Replace with your real policies before launch.
const PAGES = {
  privacy: ["Privacy Policy", "Explain which personal data you collect (name, phone, address), why you collect it, who receives it (courier) and how customers can ask you to delete it."],
  terms: ["Terms and Conditions", "Describe prices, cash on delivery payment, order confirmation by phone, delivery times and your liability."],
  returns: ["Exchange and Returns", "State your exchange window (for example 7 days), the condition items must be in (unused, with tags), and who pays for return delivery."],
  shipping: ["Delivery", "List delivery cities and times (for example 3 to 5 working days), delivery charges and the free delivery threshold."],
  contact: ["Contact Us", "Add your phone number, WhatsApp number, email, business address and opening hours."],
};

export function generateStaticParams() { return Object.keys(PAGES).map((slug) => ({ slug })); }

export default async function Page({ params }) {
  const { slug } = await params;
  const p = PAGES[slug];
  if (!p) notFound();
  return (
    <main className="wrap legal">
      <Link href="/">← Back to UASH</Link>
      <h1>{p[0]}</h1>
      <p>{p[1]}</p>
    </main>
  );
}
