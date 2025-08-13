// frontend/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
// 👇 Make sure this line exists and is not commented out
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Interview Coach",
  description: "AI-powered mock interviews to help you prepare",
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