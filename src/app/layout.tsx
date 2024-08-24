// src/app/layout.tsx

import { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import { createSupabaseServerComponentClient } from "@/lib/utils/supabase/server-client";
import 'flowbite/dist/flowbite.css';
import '../app/global.css'; // Adjust this path if your global CSS is located elsewhere

export const metadata: Metadata = {
  title: 'DreamLink',
  description: 'Connect with your dreams',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createSupabaseServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {session && <NavBar />}
        <main className="container mx-auto px-4">
          {children}
        </main>
      </body>
    </html>
  )
}