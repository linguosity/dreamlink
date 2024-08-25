// src/app/layout.tsx

import { Metadata } from 'next'
import NavBar from '../components/NavBar'
import { createSupabaseServerComponentClient } from "@/lib/utils/supabase/server-client";
import 'flowbite/dist/flowbite.css';
import '../app/global.css'; // Adjust this path if your global CSS is located elsewhere

export const metadata: Metadata = {
  title: 'DreamLink',
  description: 'Connect with your dreams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}