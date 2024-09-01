// src/app/layout.tsx

import { Metadata } from 'next'
import NavBar from '../components/NavBar'
import { createSupabaseServerComponentClient } from "@/lib/utils/supabase/server-client";
import 'flowbite/dist/flowbite.css';
import '../app/global.css'; // Adjust this path if your global CSS is located elsewhere
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100','200', '200', '300', '400', '600', '700'], // Specify the weights you want to use 
});

export const metadata: Metadata = {
  title: 'DreamLink',
  description: 'Connect with your dreams',
}
export const viewport = 'width=device-width, initial-scale=1';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}