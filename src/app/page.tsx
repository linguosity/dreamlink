"use client"

import { Navbar, Dropdown, Avatar } from "flowbite-react";
import DreamAnalysisCard from "./components/OpenAIAnalysisCard";
import { SideNavbar } from "./components/Sidebar";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert" className="p-4">
      <p>Something went wrong:</p>
      <pre className="mt-2 p-2 bg-red-100 rounded">{error.message}</pre>
    </div>
  )
}

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex flex-col h-screen">
        <header className="z-10">
          <Navbar fluid rounded>
            {/* Navbar content remains the same */}
          </Navbar>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <SideNavbar />
          <main className="flex-1 overflow-y-auto p-6">
            <DreamAnalysisCard />
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}