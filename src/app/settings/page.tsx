'use client';

import { useUserSettings } from '@/context/UserSettingsContext';
import LanguageSettings from './LanguageSettings';
import BibleVersionSettings from './BibleVersionSettings';

export default function SettingsPage() {
  const { settings } = useUserSettings();

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      <div className="space-y-6">
        <LanguageSettings />
        <BibleVersionSettings />
      </div>
    </div>
  );
}

