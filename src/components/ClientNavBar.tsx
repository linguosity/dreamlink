// components/ClientNavBar.tsx
"use client";

import React from 'react';
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";
import { UserProfile } from "../types/user";

interface ClientNavBarProps {
  user: UserProfile | null;
}

export default function ClientNavBar({ user }: ClientNavBarProps) {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/">
        <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="DreamLink Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          DreamLink
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar 
                alt="User settings" 
                img={user.avatar_url || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"} 
                rounded 
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {user.full_name || 'User'}
              </span>
              <span className="block truncate text-sm font-medium">
                {user.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <LogoutButton />
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <LoginButton />
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" active>
          Home
        </Navbar.Link>
        <Navbar.Link href="/about">
          About
        </Navbar.Link>
        <Navbar.Link href="/services">
          Services
        </Navbar.Link>
        <Navbar.Link href="/contact">
          Contact
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}