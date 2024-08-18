import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SidebarProvider } from "../context/SidebarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DreamLink",
  description: "Analyze your dreams with AI",
  // links: [{ rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.css' }]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("RootLayout: Rendering root layout");

  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <SidebarProvider>
          {children}
        </SidebarProvider>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.4.1/flowbite.min.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}