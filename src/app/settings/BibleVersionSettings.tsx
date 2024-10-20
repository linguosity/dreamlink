'use client';

import { useEffect, useState } from 'react';
import { useUserSettings } from '@/context/UserSettingsContext';
import { Dropdown } from 'flowbite-react';

const bibleVersions = [
  { code: 'KJV', name: 'King James Version' },
  { code: 'NIV', name: 'New International Version' },
  { code: 'ESV', name: 'English Standard Version' },
  { code: 'NLT', name: 'New Living Translation' },
  { code: 'TOL', name: 'Tree of Life' },
  // Add more Bible versions as needed
];

export default function BibleVersionSettings() {
  const { settings, setSettings } = useUserSettings();
  const [bibleVersion, setBibleVersionState] = useState(settings?.bible_version ?? 'KJV');

  useEffect(() => {
    setBibleVersionState(settings?.bible_version || 'KJV');
  }, [settings]);

  const handleSave = async () => {
    await setSettings(prev => prev ? { ...prev, bible_version: bibleVersion } : null);
    alert('Bible version preference saved!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Bible Version Settings</h2>
      <Dropdown label={bibleVersions.find(version => version.code === bibleVersion)?.name || 'Select Bible Version'}>
        {bibleVersions.map((version) => (
          <Dropdown.Item key={version.code} onClick={() => setBibleVersionState(version.code)}>
            {version.name}
          </Dropdown.Item>
        ))}
      </Dropdown>
      <button
        onClick={handleSave}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Save Bible Version
      </button>
    </div>
  );
}