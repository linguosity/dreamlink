"use client";

import { createSupabaseClient } from "../lib/utils/supabase/browser-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return <button onClick={handleLogout}>Logout</button>;
}