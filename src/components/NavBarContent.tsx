"use client";

import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { Dropdown, Avatar } from "flowbite-react";
import Link from "next/link";
import LogoutButton from "./logout-button";
import NavbarSearch from './NavBarSearch';

interface NavBarContentProps {
  session: Session | null;
}

export default function NavBarContent({ session }: NavBarContentProps) {
  const user = session?.user;
  const [isOpen, setIsOpen] = useState(false);

  const profilePictureUrl = user?.user_metadata?.avatar_url || "/path/to/default-avatar.jpg";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E3A8A] dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse animate-fade-right animate-once animate-delay-300">
          <span 
            className="self-center text-2xl font-semibold whitespace-nowrap text-white dark:text-white"
            style={{ fontFamily: 'Blanka, sans-serif' }}>
                DreamLink
          </span>
        </Link>
        
        {/* <div className="flex-grow mx-4">
          <NavbarSearch />
        </div> */}

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {user ? (
            <Dropdown
              inline
              label={<Avatar alt="User settings" img={profilePictureUrl} rounded />}
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
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded={isOpen}
            onClick={toggleMenu}
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
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`} id="navbar-user">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link href="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</Link>
            </li>
            <li>
              <Link href="/services" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</Link>
            </li>
            <li>
              <Link href="/contact" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
