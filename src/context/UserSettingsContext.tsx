// src/context/UserSettingsContext.tsx

"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/utils/supabase/browser-client';
import { Session } from "@supabase/supabase-js";
import { Database } from '@/types/supabase';

type UserSettings = Database['public']['Tables']['user_settings']['Row'];

interface UserSettingsContextType {
  settings: UserSettings | null;
  setSettings: (settings: Partial<UserSettings> | ((prevSettings: UserSettings | null) => UserSettings | null) | null) => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsProvider = ({ children, session }: { children: React.ReactNode, session: Session | null }) => {
  const supabase = createSupabaseBrowserClient();
  const [settings, setSettingsState] = useState<UserSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user settings:', error);
          // Set default settings if none exist
          setSettingsState({
            user_id: session.user.id,
            language: 'en',
            bible_version: 'Tree of Life',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        } else if (data) {
          setSettingsState(data as UserSettings);
        }
        console.log('Fetched user settings:', data);
      }
    };

    fetchSettings();
  }, [session, supabase]);

  const setSettings = async (newSettings: Partial<UserSettings> | ((prevSettings: UserSettings | null) => UserSettings | null) | null) => {
    if (typeof newSettings === 'function') {
      const updatedSettings = newSettings(settings);
      if (updatedSettings && session?.user) {
        const { error } = await supabase
          .from('user_settings')
          .update(updatedSettings)
          .eq('user_id', session.user.id);

        if (error) {
          console.error('Error updating settings:', error.message);
        } else {
          setSettingsState(updatedSettings);
        }
      }
    } else if (newSettings && session?.user) {
      const { error } = await supabase
        .from('user_settings')
        .update(newSettings)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error updating settings:', error.message);
      } else {
        setSettingsState(prev => prev ? { ...prev, ...newSettings } : null);
      }
    } else {
      setSettingsState(null);
    }
  };

  return (
    <UserSettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};
