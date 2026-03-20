import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Customer Satisfaction SaaS - Mercado Libre Style",
  description:
    "Customer satisfaction analysis with Mercado Libre Argentina design",
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffe600" },
    { media: "(prefers-color-scheme: dark)", color: "#ffe600" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-gray-100 text-gray-800`}
        style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
