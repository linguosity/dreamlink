// src/types/userSettings.ts

import { Database } from './supabase';

export type UserSettings = Database['public']['Tables']['user_settings']['Row'];

