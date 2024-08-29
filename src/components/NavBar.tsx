// src/components/NavBar.tsx
import { Session } from "@supabase/supabase-js";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";

interface NavBarProps {
  session: Session | null;
}

export default function NavBar({ session }: NavBarProps) {
  const user = session?.user;

  return (
    <nav>
      {user ? <LogoutButton /> : <LoginButton />}
      <span>this is a navbar</span>
    </nav>
  );
}
