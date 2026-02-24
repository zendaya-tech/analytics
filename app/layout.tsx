import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { ToastProvider } from "@/components/providers/toast-provider";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zendaya Analytics",
  description: "SaaS analytics multi-tenant avec RBAC strict",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} antialiased`}>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
