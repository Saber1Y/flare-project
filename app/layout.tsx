import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import MainLayout from "../components/ui/layout";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flare Accounting - Crypto Payments Dashboard",
  description:
    "Convert Flare transactions into ISO 20022–aligned, audit-grade payment records using ProofRails",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.className} antialiased`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
