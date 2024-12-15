"use client";

import { createSupabaseBrowserClient } from "../lib/utils/supabase/browser-client";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
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

  // Return just the text and handler, let parent handle the button
  return (
    <span onClick={handleLogout} className={className}>
      Sign out
    </span>
  );
}