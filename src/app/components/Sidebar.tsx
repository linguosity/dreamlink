"use client";

import { Sidebar, Button } from "flowbite-react";
import type { FC } from "react";
import React from "react";
import {
  HiArrowSmRight,
  HiChevronLeft,
  HiChevronRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
import { useSidebarContext } from "../../context/SidebarContext";

export const SideNavbar: FC = function () {
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  return (
    <div className="flex flex-col h-screen">
      <Sidebar aria-label="Example sidebar" collapsed={isCollapsed} className="h-full">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <div className="flex items-center justify-between p-0 m-0 align-items-center justify-items-center">
              <Button color="warning" onClick={toggleSidebar}>
                {isCollapsed ? <HiChevronRight className="w-5 h-5" /> : <HiChevronLeft className="w-5 h-5" />}
              </Button>
            </div>
            <Sidebar.Item href="#" icon={HiChartPie}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiViewBoards} label="Pro" labelColor="gray">
              Kanban
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiInbox} label="3">
              Inbox
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiUser}>
              Users
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiShoppingBag}>
              Products
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiArrowSmRight}>
              Sign In
            </Sidebar.Item>
            <Sidebar.Item href="#" icon={HiTable}>
              Sign Up
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
};