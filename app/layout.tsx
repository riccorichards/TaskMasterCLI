import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const inter = Fredoka({ subsets: ["latin"], weight: ["400"] });

export const metadata: Metadata = {
  title: "Create your Dream",
  description: "TaskMaster CLI: Master time, excel professionally. Free, open-source, indispensable for every industry pro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
