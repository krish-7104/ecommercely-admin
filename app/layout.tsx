import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/redux/provider";
import Sidebar from "@/components/sidebar";
const montserrat = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
          <main className="flex">
            <Sidebar />
            <div className="h-[100vh] w-[80%] bg-[#f6f6f6]">{children}</div>
          </main>
          <Toaster position="bottom-right" />
        </body>
      </Providers>
    </html>
  );
}
