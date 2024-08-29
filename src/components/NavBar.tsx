// src/components/NavBar.tsx
import { Session } from "@supabase/supabase-js";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";
import NavBarContent from "./NavBarContent";

interface NavBarProps {
  session: Session | null;
}

export default function NavBar({ session }: NavBarProps) {
  return <NavBarContent session={session} />;
}