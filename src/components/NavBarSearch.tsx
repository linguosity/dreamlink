"use client";

import React, { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/utils/supabase/browser-client';
import { DreamItem } from '../types/dreamAnalysis';
import { Session } from '@supabase/supabase-js';

interface NavbarSearchProps {
  onSearch: (results: DreamItem[]) => void;
  session: Session | null;
}

export default function NavbarSearch({ onSearch, session }: NavbarSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    fetchTags();
  }, [session]);

  useEffect(() => {
    console.log('=== Search Effect Triggered ===');
    console.log('Current tag:', selectedTag);
    console.log('Current search term:', searchTerm);

    const runSearch = async () => {
      const results = await searchDreams();
      console.log('Search results from effect:', results);
      onSearch(results);
    };

    if (session?.user) {
      runSearch();
    }
  }, [selectedTag, searchTerm, session]);

  async function fetchTags() {
    if (!session?.user) {
      console.log('No session for fetching tags');
      return;
    }

    console.log('Fetching tags for user:', session.user.id);

    // Step 1: Get all dream analyses IDs for the current user
    const { data: dreamAnalyses, error: daError } = await supabase
      .from('dream_analyses')
      .select('id')
      .eq('user_id', session.user.id);

    if (daError) {
      console.error('Error fetching user dream analyses:', daError);
      return;
    }

    // Extract the dream_analysis_ids into an array
    const dreamAnalysisIds = dreamAnalyses?.map(d => d.id) || [];

    if (dreamAnalysisIds.length === 0) {
      // User has no dream_analyses, so no tags are associated
      console.log('No dreams found for user');
      setTags([]);
      return;
    }

    // Step 2: Get all tag_ids from dream_tags linked to the user's dream_analyses
    const { data: dreamTagRows, error: dtError } = await supabase
      .from('dream_tags')
      .select('tag_id')
      .in('dream_analysis_id', dreamAnalysisIds);

    if (dtError) {
      console.error('Error fetching dream_tags:', dtError);
      return;
    }
    // Extract unique tag_ids using Array.from() for better TypeScript compatibility
    const tagIds = dreamTagRows ? Array.from(new Set(dreamTagRows.map(dt => dt.tag_id))) : [];

    if (tagIds.length === 0) {
      // No tags associated with this user's dreams
      console.log('No tags found for user\'s dreams');
      setTags([]);
      return;
    }

    // Step 3: Get tags by those tag_ids
    const { data: userTags, error: tagError } = await supabase
      .from('tags')
      .select('name')
      .in('id', tagIds)
      .order('name');

    if (tagError) {
      console.error('Error fetching user tags:', tagError);
      return;
    }

    console.log('Retrieved tags for user:', userTags);
    setTags(userTags.map(t => t.name));
  }

  const handleTagSelect = (tag: string) => {
    console.log('=== Tag Selection ===');
    console.log('Previous tag:', selectedTag);
    console.log('New tag selected:', tag);
    
    setSelectedTag(tag);
    setIsDropdownOpen(false);
  };

  async function searchDreams() {
    try {
      if (!session?.user) {
        console.log('No user session, returning empty results');
        return [];
      }

      let query;
      
      if (selectedTag !== 'All Tags') {
        console.log('Fetching tag_id for:', selectedTag);
        const { data: tagData, error: tagError } = await supabase
          .from('tags')
          .select('id')
          .eq('name', selectedTag)
          .maybeSingle();

        if (tagError) {
          console.error('Error fetching tag_id:', tagError);
          return [];
        }

        if (!tagData) {
          console.log('No tag found with name:', selectedTag);
          return [];
        }

        console.log('Found tag_id:', tagData.id, 'for tag:', selectedTag);

        query = supabase
          .from('dream_analyses')
          .select(`
            *,
            dream_tags!inner(
              tags(
                id,
                name
              )
            ),
            interpretation_elements(*),
            verses(*)
          `)
          .eq('user_id', session.user.id)
          .eq('dream_tags.tag_id', tagData.id);
      } else {
        query = supabase
          .from('dream_analyses')
          .select(`
            *,
            dream_tags(
              tags(
                id,
                name
              )
            ),
            interpretation_elements(*),
            verses(*)
          `)
          .eq('user_id', session.user.id);
      }

      const trimmedTerm = searchTerm.trim();
      if (trimmedTerm) {
        console.log('Applying text search:', trimmedTerm);
        query = query.textSearch('search_vector', trimmedTerm);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Search query error:', error);
        return [];
      }

      console.log('Raw query results:', data);
      console.log('Number of results:', data?.length || 0);
      
      return data.map(item => ({
        ...item,
        status: 'complete' as const,
        dream_tags: item.dream_tags?.map((dt: { tags?: { id?: string; name?: string } }) => ({
          tags: {
            id: dt.tags?.id || '',
            name: dt.tags?.name || ''
          }
        })) || []
      })) as DreamItem[];

    } catch (err) {
      console.error('Search error:', err);
      return [];
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted - search term:', searchTerm);
  };

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
          <div className="z-10 absolute mt-12 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 max-h-80 overflow-y-auto">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <button 
                  type="button" 
                  onClick={() => handleTagSelect('All Tags')} 
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  All Tags
                </button>
              </li>
              {tags.map((tag, index) => (
                <li key={index}>
                  <button 
                    type="button" 
                    onClick={() => handleTagSelect(tag)} 
                    className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {tag}
                  </button>
                </li>
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