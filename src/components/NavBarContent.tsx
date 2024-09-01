"use client";

import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import Link from "next/link";
import LogoutButton from "./logout-button";
import { Lobster } from 'next/font/google';

interface NavBarContentProps {
  session: Session | null;
}

// If loading a variable font, you don't need to specify the font weight
const lobster = Lobster({ subsets: ['latin'], weight: ['400'] })

export default function NavBarContent({ session }: NavBarContentProps) {
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false);

  const profilePictureUrl = user?.user_metadata?.avatar_url || "/path/to/default-avatar.jpg";


  

  return (
    <nav className="bg-[#1E3A8A] dark:bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo and Menu Group */}
        <div className="flex items-center justify-start space-x-8">
          <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className={`${lobster.className} self-center text-2xl font-semibold whitespace-nowrap text-white dark:text-white`}>
              DreamLink
            </span>
          </Link>
          {/* Middle Menu */}
          <ul className="flex space-x-8">
            <li>
              <Link
                href="/"
                className="text-white bg-blue-700 rounded md:bg-transparent md:text-white md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
        {/* User Profile or Login Button */}
        <div className="flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse">
          {user ? (
            <Dropdown
              inline
              label={<Avatar alt="User settings" img={profilePictureUrl} rounded />}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Dropdown.Header>
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user.email}
                </span>
              </Dropdown.Header>
              <Dropdown.Item>
                <Link href="/account">Dashboard</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href="/settings">Settings</Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item as="div">
                <LogoutButton />
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <Link
              href="/login"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              Log in
            </Link>
          )}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
