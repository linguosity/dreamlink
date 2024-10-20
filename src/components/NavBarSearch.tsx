import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase'
import { DreamItem } from '../types/dreamAnalysis';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface NavbarSearchProps {
    onSearch: (results: DreamItem[]) => void;
  }

export default function NavbarSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    const { data, error } = await supabase
      .from('tags')
      .select('name')
      .order('name');
    
    if (error) {
      console.error('Error fetching tags:', error);
    } else {
      setTags(data.map(tag => tag.name));
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const searchTags = selectedTag === 'All Tags' ? [searchTerm] : [selectedTag, searchTerm];
    const results = await searchDreamsByTags(searchTags);
    console.log('Search results:', results);
    // Here you would typically update your app's state or navigate to a results page
  }

  async function searchDreamsByTags(tags: string[]) {
    const { data, error } = await supabase
      .from('dream_analyses')
      .select(`
        id,
        title,
        original_dream,
        dream_tags!inner (
          tags (
            name
          )
        )
      `)
      .contains('dream_tags.tags.name', tags);

    if (error) {
      console.error('Error searching dreams:', error);
      return null;
    }

    return data;
  }

  return (
    <form onSubmit={handleSearch} className="max-w-lg mx-auto">
      <div className="flex">
        <button 
          id="dropdown-button" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          type="button" 
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
        >
          {selectedTag} <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="z-10 absolute mt-12 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li><button type="button" onClick={() => { setSelectedTag('All Tags'); setIsDropdownOpen(false); }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">All Tags</button></li>
              {tags.map((tag, index) => (
                <li key={index}><button type="button" onClick={() => { setSelectedTag(tag); setIsDropdownOpen(false); }} className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{tag}</button></li>
              ))}
            </ul>
          </div>
        )}
        <div className="relative w-full">
          <input 
            type="search" 
            id="search-dropdown" 
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" 
            placeholder="Search dreams..." 
            required 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
}