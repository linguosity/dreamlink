"use client";

import { useEffect, useState } from 'react';
import { useUserSettings } from '@/context/UserSettingsContext';
import { Dropdown } from 'flowbite-react';

interface Option {
  value: string;
  label: string;
}

interface LanguageSettingsProps {
  options: Option[];
  defaultValue: string;
  className?: string;
}

export default function LanguageSettings({ options, defaultValue, className }: LanguageSettingsProps) {
  const { settings, setSettings, showNotification } = useUserSettings();
  const [language, setLanguage] = useState<string>(defaultValue);

  // Ensure the language is in sync with defaultValue
  useEffect(() => {
    if (defaultValue && language !== defaultValue) {
      setLanguage(defaultValue);
    }
  }, [defaultValue]);

  const handleSave = async () => {
    await setSettings((prev) => (prev ? { ...prev, language } : null));
    showNotification('Language preference updated successfully!', 'success');
  };

  const selectedOption = options.find((opt) => opt.value === language);

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full">
        <Dropdown
          label={selectedOption?.label || 'Select Language'}
          className={`dropdown-label-override text-black ${className ?? ''}`}
        >
          {options.map((lang) => (
            <Dropdown.Item key={lang.value} onClick={() => setLanguage(lang.value)}>
              {lang.label}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <button
        onClick={handleSave}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Save Language
      </button>
    </div>
  );
}