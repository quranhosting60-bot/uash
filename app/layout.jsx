import "./globals.css";
import { Jost, Inter } from "next/font/google";

const head = Jost({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--f-head" });
const body = Inter({ subsets: ["latin"], variable: "--f-body" });

export const metadata = {
  metadataBase: new URL("https://falestix.store"),
  title: { default: "Falestix | Women, Men, Kids & Home", template: "%s | Falestix" },
  description: "Women, men, kids and home essentials delivered across Pakistan. Pay cash on delivery.",
  openGraph: { title: "Falestix", description: "Fashion, kitchenware and home essentials. Pay on delivery.", url: "https://falestix.store", siteName: "Falestix", type: "website" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
