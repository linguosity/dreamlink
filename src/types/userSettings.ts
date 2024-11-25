// src/types/userSettings.ts

import { Database } from './supabase';

export type UserSettingsRow = Database['public']['Tables']['user_settings']['Row'];
export type UserSettings = UserSettingsRow | null;

