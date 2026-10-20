import "./globals.css";
import { Cormorant_Garamond, Inter } from "next/font/google";

const head = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--f-head" });
const body = Inter({ subsets: ["latin"], variable: "--f-body" });

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://uash.vercel.app"),
  title: { default: "UASH | Luxury, Decor & Kitchenware", template: "%s | UASH" },
  description: "Luxury bedding, home decor and kitchenware delivered across Pakistan. Pay cash on delivery.",
  openGraph: { title: "UASH", description: "Luxury, decor and kitchenware. Pay on delivery.", siteName: "UASH", type: "website" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
