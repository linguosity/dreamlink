import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "../app/components/SupabaseProvider" // Adjust the import path as needed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DreamLink",
  description: "Analyze your dreams with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("RootLayout: Rendering root layout");
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  )
}