// types/user.ts

export interface UserProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string; // Email is required
  }