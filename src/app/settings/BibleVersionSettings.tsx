'use client';

import { useEffect, useState } from 'react';
import { useUserSettings } from '@/context/UserSettingsContext';
import { Dropdown } from 'flowbite-react';

interface Option {
  value: string;
  label: string;
}

interface BibleVersionSettingsProps {
  options: Option[];
  defaultValue: string;
  className?: string;
}

export default function BibleVersionSettings({ options, defaultValue, className }: BibleVersionSettingsProps) {
  const { settings, setSettings, showNotification } = useUserSettings();
  const [bibleVersion, setBibleVersion] = useState<string>(defaultValue);

  useEffect(() => {
    // Update state if defaultValue changes
    setBibleVersion(defaultValue);
  }, [defaultValue]);

  const handleSave = async () => {
    await setSettings(prev => prev ? { ...prev, bible_version: bibleVersion } : null);
    showNotification('Bible version updated successfully!', 'success');
  };

  const selectedOption = options.find(opt => opt.value === bibleVersion);

  return (
    <div className="flex flex-col space-y-4">
      <div className="w-full">
        <Dropdown
          label={selectedOption?.label || 'Select Bible Version'}
          className={`dropdown-label-override text-black ${className ?? ''}`}
        >
          {options.map((version) => (
            <Dropdown.Item key={version.value} onClick={() => setBibleVersion(version.value)}>
              {version.label}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
      <button
        onClick={handleSave}
        className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Save Bible Version
      </button>
    </div>
  );
}