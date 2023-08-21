"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/navbar";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ecommerce Admin Panel",
  description: "Admin Dashboard for Ecommerce Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {!isLoginPage && <Navbar />}
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
