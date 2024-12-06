'use client';

import { useEffect, useState } from 'react';
import { useUserSettings } from '@/context/UserSettingsContext';
import { Dropdown } from 'flowbite-react';

const languages = [
  { code: 'simple', name: 'Simple (Generic)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'eu', name: 'Basque' },
  { code: 'ca', name: 'Catalan' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sr', name: 'Serbian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tr', name: 'Turkish' },
  { code: 'yi', name: 'Yiddish' },
];


export default function LanguageSettings() {
  const { settings, setSettings, showNotification } = useUserSettings();
  const [language, setLanguageState] = useState(settings?.language ?? 'en');

  useEffect(() => {
    setLanguageState(settings?.language || 'en');
  }, [settings]);

  const handleSave = async () => {
    await setSettings(prev => prev ? { ...prev, language } : null);
    showNotification('Language preference updated successfully!', 'success');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Language Settings</h2>
      <Dropdown label={languages.find(lang => lang.code === language)?.name || 'Select Language'}>
        {languages.map((lang) => (
          <Dropdown.Item key={lang.code} onClick={() => setLanguageState(lang.code)}>
            {lang.name}
          </Dropdown.Item>
        ))}
      </Dropdown>
      <button
        onClick={handleSave}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Save Language
      </button>
    </div>
  );
}