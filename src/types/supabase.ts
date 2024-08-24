// src>types>supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dream_analyses: {
        Row: {
          color_symbolism: string | null
          created_at: string | null
          gematria_interpretation: string | null
          id: string
          original_dream: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          color_symbolism?: string | null
          created_at?: string | null
          gematria_interpretation?: string | null
          id?: string
          original_dream: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          color_symbolism?: string | null
          created_at?: string | null
          gematria_interpretation?: string | null
          id?: string
          original_dream?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dream_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dream_entries: {
        Row: {
          analysis: Json
          created_at: string
          dream_analysis_id: string | null
          id: number
          user_id: string
        }
        Insert: {
          analysis: Json
          created_at?: string
          dream_analysis_id?: string | null
          id?: number
          user_id: string
        }
        Update: {
          analysis?: Json
          created_at?: string
          dream_analysis_id?: string | null
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dream_entries_dream_analysis_id_fkey"
            columns: ["dream_analysis_id"]
            isOneToOne: false
            referencedRelation: "dream_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dream_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dream_tags: {
        Row: {
          dream_analysis_id: string
          tag_id: string
        }
        Insert: {
          dream_analysis_id: string
          tag_id: string
        }
        Update: {
          dream_analysis_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dream_tags_dream_analysis_id_fkey"
            columns: ["dream_analysis_id"]
            isOneToOne: false
            referencedRelation: "dream_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dream_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      interpretation_elements: {
        Row: {
          content: string
          dream_analysis_id: string | null
          id: string
          is_popover: boolean
          order_index: number
          popover_content: string | null
        }
        Insert: {
          content: string
          dream_analysis_id?: string | null
          id?: string
          is_popover: boolean
          order_index: number
          popover_content?: string | null
        }
        Update: {
          content?: string
          dream_analysis_id?: string | null
          id?: string
          is_popover?: boolean
          order_index?: number
          popover_content?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interpretation_elements_dream_analysis_id_fkey"
            columns: ["dream_analysis_id"]
            isOneToOne: false
            referencedRelation: "dream_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      verses: {
        Row: {
          book: string | null
          dream_analysis_id: string | null
          explanation: string | null
          id: string
          reference: string
          text: string
        }
        Insert: {
          book?: string | null
          dream_analysis_id?: string | null
          explanation?: string | null
          id?: string
          reference: string
          text: string
        }
        Update: {
          book?: string | null
          dream_analysis_id?: string | null
          explanation?: string | null
          id?: string
          reference?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "verses_dream_analysis_id_fkey"
            columns: ["dream_analysis_id"]
            isOneToOne: false
            referencedRelation: "dream_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
