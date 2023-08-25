import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/navbar";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/redux/provider";
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
  return (
    <html lang="en">
      <Providers>
        <body className={montserrat.className}>
          <Navbar />
          {children}
          <Toaster position="bottom-right" />
        </body>
      </Providers>
    </html>
  );
}
