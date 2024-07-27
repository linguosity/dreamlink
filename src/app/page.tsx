"use client"

import { Navbar, Dropdown, Avatar } from "flowbite-react";
import DreamAnalysisCard from "../app/components/OpenAIAnalysisCard";
import { SideNavbar } from "../app/components/Sidebar";

export default function Home() {
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
            <Navbar.Link href="#" active>Home</Navbar.Link>
            <Navbar.Link href="#">About</Navbar.Link>
            <Navbar.Link href="#">Services</Navbar.Link>
            <Navbar.Link href="#">Pricing</Navbar.Link>
            <Navbar.Link href="#">Contact</Navbar.Link>
          </Navbar.Collapse>
        </Navbar>
      </header>
      <main className="flex h-screen">
        <SideNavbar />
        <div className="flex-grow p-6">
          <DreamAnalysisCard />
        </div>
      </main>
    </>
  );
}