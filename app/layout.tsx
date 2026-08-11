import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
});

export const metadata: Metadata = {
  title: "ResitLog — Simpan resit belanja harian",
  description: "Snap, rekod dan jejak perbelanjaan melalui resit.",
};

export const viewport: Viewport = {
  themeColor: "#6e1428",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms">
      <body className={`${archivo.variable} antialiased`}>{children}</body>
    </html>
  );
}
