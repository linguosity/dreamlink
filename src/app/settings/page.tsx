"use client";

import { useUserSettings } from '@/context/UserSettingsContext';
import LanguageSettings from './LanguageSettings';
import BibleVersionSettings from './BibleVersionSettings';
import { Card } from "flowbite-react";
import { GlobeAltIcon, BookOpenIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const { settings } = useUserSettings();

  if (!settings) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  }

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' }
  ];

  const bibleVersionOptions = [
    { value: 'KJV', label: 'King James Version (KJV)' },
    { value: 'NIV', label: 'New International Version (NIV)' },
    { value: 'ESV', label: 'English Standard Version (ESV)' }
  ];

  const defaultLanguage = settings.language || languageOptions[0].value;
  const defaultBibleVersion = settings.bible_version || bibleVersionOptions[0].value;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Language Settings */}
        <Card className="p-6 flex flex-row items-start space-x-4">
          <GlobeAltIcon className="h-10 w-10 text-blue-600 flex-shrink-0" />
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold text-gray-900">Language Settings</h2>
            <p className="text-sm text-gray-500 mt-2">
              Select your preferred language for dream analysis and Bible references.
            </p>
            <div className="mt-4">
              <LanguageSettings
                options={languageOptions}
                defaultValue={defaultLanguage}
                className="border border-gray-400 rounded"
              />
            </div>
          </div>
        </Card>

        {/* Bible Version Settings */}
        <Card className="p-6 flex flex-row items-start space-x-4">
          <BookOpenIcon className="h-10 w-10 text-blue-600 flex-shrink-0" />
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold text-gray-900">Bible Version Settings</h2>
            <p className="text-sm text-gray-500 mt-2">
              Choose which Bible translation to use in dream interpretations.
            </p>
            <div className="mt-4">
              <BibleVersionSettings
                options={bibleVersionOptions}
                defaultValue={defaultBibleVersion}
                className="border border-gray-400 rounded"
              />
            </div>
          </div>
        </Card>

        {/* Additional Settings */}
        <Card className="p-6 flex flex-row items-start space-x-4">
          <AdjustmentsHorizontalIcon className="h-10 w-10 text-blue-600 flex-shrink-0" />
          <div className="flex flex-col flex-1">
            <h2 className="text-xl font-bold text-gray-900">Additional Settings</h2>
            <p className="text-sm text-gray-500 mt-2">
              Further customize your dream analysis experience.
            </p>
            <div className="mt-4 text-sm text-gray-700">
              <p className="font-semibold">Coming soon:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Notification Preferences</li>
                <li>Data Export Options</li>
                <li>Personalization Settings</li>
              </ul>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}