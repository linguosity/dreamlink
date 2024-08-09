"use client"

import { useState } from "react";
import { Navbar, Dropdown, Avatar } from "flowbite-react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useChat } from 'ai/react';
import { AnimatePresence } from 'framer-motion';
import DreamInput from "./components/DreamInput";
import { SideNavbar } from "./components/Sidebar";
import LoadingDreamCard from "./components/LoadingDreamCard";
import AnimatedDreamCard from "./components/AnimatedDreamCard";
import { DreamAnalysis } from './types/dreamAnalysis';

interface DreamItem {
  id: number;
  status: 'loading' | 'complete';
  data?: DreamAnalysis;
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
  const [dreamItems, setDreamItems] = useState<DreamItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { messages, input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    onResponse: async (response) => {
      console.log('API Response received:', response);
      if (response.ok) {
        try {
          const responseData: DreamAnalysis = await response.json();
          console.log('Parsed API response:', responseData);
          
          if (!Array.isArray(responseData.verses)) {
            responseData.verses = [];
          }

          const originalDream = localStorage.getItem('lastDreamInput') || '';
          responseData.originalDream = originalDream;

          setDreamItems(prevItems => prevItems.map(item => 
            item.status === 'loading' ? { ...item, status: 'complete', data: responseData } : item
          ));
          setError(null);
        } catch (err) {
          console.error('Error parsing response:', err);
          setError('Failed to parse the dream analysis. Please try again.');
          setDreamItems(prevItems => prevItems.filter(item => item.status !== 'loading'));
        }
      } else {
        console.error('API response not ok:', response.statusText);
        const errorData = await response.json();
        setError(`Error: ${errorData.error}. ${errorData.details || ''}`);
        setDreamItems(prevItems => prevItems.filter(item => item.status !== 'loading'));
      }
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setError(`An error occurred: ${error.message}`);
      setDreamItems(prevItems => prevItems.filter(item => item.status !== 'loading'));
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    localStorage.setItem('lastDreamInput', input);
    const newDreamItem: DreamItem = { id: Date.now(), status: 'loading' };
    setDreamItems(prevItems => [...prevItems, newDreamItem]);
    originalHandleSubmit(e);
  };

  console.log("DreamItems state:", dreamItems);
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
                <AnimatePresence>
                  {dreamItems.map((item) => (
                    <div key={item.id} className="w-full max-w-sm mx-auto">
                      {item.status === 'loading' ? (
                        <LoadingDreamCard />
                      ) : item.data ? (
                        <AnimatedDreamCard dream={item.data} />
                      ) : null}
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}