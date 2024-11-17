"use client";

import { createSupabaseBrowserClient } from "../lib/utils/supabase/browser-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleLogout = async () => {
    console.log('Starting logout...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
    } else {
      console.log('Logout successful');
      router.refresh();
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}