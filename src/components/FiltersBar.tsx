"use client";

import React from 'react';
import { Session } from '@supabase/supabase-js';
import NavbarSearch from './NavBarSearch';

interface FiltersBarProps {
  session: Session | null;
  selectedTag: string;
  onTagSelect: (tag: string) => void;
  onSearch: (results: any[]) => void;
}

export default function FiltersBar({
  session,
  selectedTag,
  onTagSelect,
  onSearch
}: FiltersBarProps) {
  return (
    <div className="w-full bg-gray-900 text-white py-3 px-4 flex items-center justify-between">
      {/* Placeholder for future tags or additional filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Filter by Tag:</span>
        {/* If you want a standalone tag dropdown or filters, add them here */}
      </div>

      {session && (
        <div className="max-w-sm w-full">
          <NavbarSearch
            session={session}
            onSearch={onSearch}
            selectedTag={selectedTag}
            onTagSelect={onTagSelect}
          />
        </div>
      )}
    </div>
  );
}