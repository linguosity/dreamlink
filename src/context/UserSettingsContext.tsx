// src/context/UserSettingsContext.tsx

"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/utils/supabase/browser-client';
import { Session } from "@supabase/supabase-js";
import { Database } from '@/types/supabase';
import { UserSettings, UserSettingsRow } from '@/types/userSettings';
import { AnimatePresence } from 'framer-motion';
import { NotificationToast } from '@/components/NotificationToast'

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UserSettingsContextType {
  settings: UserSettings;
  setSettings: (settings: Partial<UserSettingsRow> | ((prevSettings: UserSettings) => UserSettings) | null) => Promise<void>;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsProvider = ({ children, session }: { children: React.ReactNode, session: Session | null }) => {
  const supabase = createSupabaseBrowserClient();
  const [settings, setSettingsState] = useState<UserSettings>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  const setSettings = async (newSettings: Partial<UserSettingsRow> | ((prevSettings: UserSettings) => UserSettings) | null) => {
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

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 3000);
  };

  return (
    <UserSettingsContext.Provider value={{ settings, setSettings, showNotification }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationToast
              key={notification.id}
              message={notification.message}
              type={notification.type}
            />
          ))}
        </AnimatePresence>
      </div>
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
