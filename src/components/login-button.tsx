"use client";

import { Button } from 'flowbite-react';
import { createSupabaseClient} from "../lib/utils/supabase/browser-client";

export default function LoginButton(props: { nextUrl?: string }) {
  const supabase = createSupabaseClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${
          props.nextUrl || ""
        }`,
      },
    });
  };

  return (
    <Button onClick={handleLogin} color="blue" className="w-full">
      Google
    </Button>
  );
}