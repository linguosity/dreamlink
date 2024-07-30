"use client"

import { useState } from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import DreamAnalysisCard from "./components/OpenAIAnalysisCard";
import DreamInput from "./components/DreamInput";
import { SideNavbar } from "./components/Sidebar";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useChat } from 'ai/react';

// Define the structure of a dream analysis
interface DreamAnalysis {
  title: string;
  summary: string;
  tags: string[];
  interpretation: Array<{ verse: string; explanation: string; book: string }>;
}

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert" className="p-4">
      <p>Something went wrong:</p>
      <pre className="mt-2 p-2 bg-red-100 rounded">{error.message}</pre>
    </div>
  )
}

export default function Home() {
  const [dreams, setDreams] = useState<DreamAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    onResponse: async (response) => {
      console.log('API Response received:', response);
      if (response.ok) {
        try {
          const responseData: DreamAnalysis = await response.json();
          console.log('Parsed API response:', responseData);
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


  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex flex-col h-screen">
        <header className="z-10">
          <Navbar fluid rounded>
            <Navbar.Brand href="https://flowbite-react.com">
              <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
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
          <main className="flex-1 overflow-y-auto p-6">
            <DreamInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {dreams.map((dream, index) => (
                <DreamAnalysisCard key={index} dream={dream} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}