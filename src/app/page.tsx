"use client"

import { useState } from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import DreamAnalysisCard from "./components/OpenAIAnalysisCard";
import DreamInput from "./components/DreamInput";
import { SideNavbar } from "./components/Sidebar";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useChat } from 'ai/react';

interface Verse {
  reference: string;
  text: string;
}

interface DreamAnalysis {
  title: string;
  interpretation: string;
  tags: string[];
  verses: Verse[];
  originalDream: string; // Add this line
}

function ErrorFallback({ error }: FallbackProps) {
  console.error("Error caught by boundary:", error);
  return (
    <div role="alert" className="p-4">
      <p>Something went wrong:</p>
      <pre className="mt-2 p-2 bg-red-100 rounded">{error.message}</pre>
    </div>
  )
}

export default function Home() {
  console.log("Home component rendering");
  const [dreams, setDreams] = useState<DreamAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    onResponse: async (response) => {
      console.log('API Response received:', response);
      if (response.ok) {
        try {
          const responseData: DreamAnalysis = await response.json();
          console.log('Parsed API response:', responseData);
          
          // Ensure verses array is present
          if (!Array.isArray(responseData.verses)) {
            responseData.verses = [];
          }

           // Retrieve the original dream from localStorage
           const originalDream = localStorage.getItem('lastDreamInput') || '';

           responseData.originalDream = originalDream;

          setDreams(prevDreams => [...prevDreams, responseData]);
          setError(null);
        } catch (err) {
          console.error('Error parsing response:', err);
          setError('Failed to parse the dream analysis. Please try again.');
        }
      } else {
        console.error('API response not ok:', response.statusText);
        const errorData = await response.json();
        setError(`Error: ${errorData.error}. ${errorData.details || ''}`);
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setError(`An error occurred: ${error.message}`);
    },
  });

  // Custom handle submit to save the original dream input
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    localStorage.setItem('lastDreamInput', input);
    originalHandleSubmit(e);
  };

  console.log("Dreams state:", dreams);
  console.log("Error state:", error);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex flex-col h-screen">
        <header className="z-10">
          <Navbar fluid rounded>
            <Navbar.Brand href="https://flowbite-react.com">
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Dreamlink</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
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
        <div className="flex flex-1 overflow-hidden">
          <SideNavbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <DreamInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
              <hr className="my-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {dreams.map((dream, index) => (
                  <div key={index} className="w-full max-w-sm mx-auto">
                    <DreamAnalysisCard dream={dream} />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}