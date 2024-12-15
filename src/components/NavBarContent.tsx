"use client";

import { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { DreamItem } from "@/types/dreamAnalysis";
import { UserSettingsRow } from "@/types/userSettings";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import LogoutButton from "./logout-button";

interface NavBarContentProps {
  session: Session | null;
  initialDreams: DreamItem[];
  initialError: null | string;
  userSettings: UserSettingsRow | null;
}

export default function NavBarContent({
  session,
  initialDreams,
  initialError,
  userSettings
}: NavBarContentProps) {

  const userName = session?.user?.user_metadata?.name ?? "User";
  const userEmail = session?.user?.email ?? "";
  const userPicture = session?.user?.user_metadata?.picture ?? "https://flowbite.com/docs/images/people/profile-picture-5.jpg";

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-opacity-90 backdrop-blur-sm bg-black border-b border-gray-600">
      <Navbar fluid rounded className="!py-2">
        <Navbar.Brand href="#">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Dreamlink
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          {session ? (
            <Dropdown
              arrowIcon={false}
              inline
              className="bg-white text-black"
              label={
                <Avatar
                  alt="User settings"
                  img={userPicture}
                  rounded
                />
              }
            >
              <Dropdown.Header>
                <span className="block text-sm">{userName}</span>
                <span className="block truncate text-sm font-medium">{userEmail}</span>
              </Dropdown.Header>
              <Dropdown.Item>Dashboard</Dropdown.Item>
              <Dropdown.Item><Link href="/settings"> Settings </Link></Dropdown.Item>
              <Dropdown.Item>Earnings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                <LogoutButton className="w-full" />
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <a href="/signin" className="text-white">
              Sign In
            </a>
          )}
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="#" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#">About</Navbar.Link>
          <Navbar.Link href="#">Services</Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Contact</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}