// types/user.ts

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null; // Update to nullable since `email` in the Supabase profile can be null
}