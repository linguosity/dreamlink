'use client';

import { useEffect, useState } from 'react';
import { useUserSettings } from '@/context/UserSettingsContext';
import { Dropdown } from 'flowbite-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  // Add more languages as needed
];

export default function LanguageSettings() {
  const { settings, setSettings } = useUserSettings();
  const [language, setLanguageState] = useState(settings?.language ?? 'en');

  useEffect(() => {
    setLanguageState(settings?.language || 'en');
  }, [settings]);

  const handleSave = async () => {
    await setSettings(prev => prev ? { ...prev, language } : null);
    console.log('Updated language setting:', language);
    alert('Language preference saved!');
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