'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSupabaseData } from '@/utils/supabase/client';

const SupabaseContext = createContext<any>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSupabaseData()
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