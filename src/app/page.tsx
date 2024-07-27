"use client"

import Link from "next/link";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import Image from "next/image";
import { useSidebarContext } from "../context/SidebarContext";
import { Sidebar } from "flowbite-react";
import DreamAnalysisCard from "./components/OpenAIAnalysisCard";
import type { FC } from "react";
import { BiBuoy } from "react-icons/bi";
import { SideNavbar } from "./components/Sidebar";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";

export default function Home() {

  const { isCollapsed } = useSidebarContext();

  return (
    <>
    <header>
      <Navbar fluid rounded>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">name@flowbite.com</span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
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
    </header>
    <main className="flex h-screen">
        <SideNavbar />
        <DreamAnalysisCard />
        <div className="flex-grow p-6">
          <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
            {/* Your content here */}
          </div>
        </div>
      </main>
  </>
  );
}
