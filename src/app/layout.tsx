import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WHAZUP - Discover Events",
  description: "Swipe through events and discover what's happening around you",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={ `${inter.className} relative min-h-screen` }>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 z-0" />
        <div className="relative z-10">{ children }</div>
      </body>
    </html>
  );
}
