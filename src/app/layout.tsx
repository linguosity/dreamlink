// src/app/layout.tsx

import { Metadata } from 'next'
import Head from 'next/head';
import { headers } from 'next/headers'  // Add this import
import NavBar from '../components/NavBar'
import { createSupabaseServerClient } from '@/lib/utils/supabase/server-client';
import 'flowbite/dist/flowbite.css';
import '../app/globals.css'; // Adjust this path if your global CSS is located elsewhere
import { Poppins } from 'next/font/google';
import styles from '../components/LoginPage.module.css';
import { UserSettingsProvider } from '@/context/UserSettingsContext';
import NebulaBackground from '@/components/NebulaBackground';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '600', '700'], // Specify the weights you want to use
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
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body className={`${poppins.className} bg-black min-h-screen`}>
        <UserSettingsProvider session={session}>
          {session && <NavBar session={session} />}
          <div className="content-wrapper">
            <main className={isLoginPage ? 'h-screen' : 'pt-0'}>
              <NebulaBackground />
              {children}
            </main>
          </div>
        </UserSettingsProvider>
      </body>
    </html>
  );
}
