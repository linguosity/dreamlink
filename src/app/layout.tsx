// src/app/layout.tsx

import { Metadata } from 'next'
import Head from 'next/head';
import NavBar from '../components/NavBar'
import { createSupabaseServerComponentClient } from "@/lib/utils/supabase/server-client";
import 'flowbite/dist/flowbite.css';
import '../app/global.css'; // Adjust this path if your global CSS is located elsewhere
import { Poppins } from 'next/font/google';
import styles from '../components/LoginPage.module.css';
import { UserSettingsProvider } from '@/context/UserSettingsContext';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100','200', '200', '300', '400', '600', '700'], // Specify the weights you want to use 
});

export const metadata: Metadata = {
  title: 'DreamLink',
  description: 'Connect with your dreams',
}
export const viewport = 'width=device-width, initial-scale=1';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <Head>
        <link
          rel="preload"
          href="/fonts/Blanka.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
      </Head>
      <UserSettingsProvider session={session}>
        <body>
        <NavBar session={session} />
        {children}
        </body>
      </UserSettingsProvider>
      
    </html>
  );
}