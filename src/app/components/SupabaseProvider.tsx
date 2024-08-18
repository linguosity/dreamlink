'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const SupabaseContext = createContext<any>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/supabase')
      .then(response => response.json())
      .then(result => setData(result.data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <SupabaseContext.Provider value={{ data, error }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => useContext(SupabaseContext);