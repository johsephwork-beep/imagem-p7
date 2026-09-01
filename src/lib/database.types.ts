export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      duel_matches: {
        Row: {
          created_at: string
          id: string
          p1_answered: number
          p1_done: boolean
          p1_id: string
          p1_name: string
          p1_score: number
          p2_answered: number
          p2_done: boolean
          p2_id: string | null
          p2_name: string | null
          p2_score: number
          question_ids: string[]
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          p1_answered?: number
          p1_done?: boolean
          p1_id: string
          p1_name: string
          p1_score?: number
          p2_answered?: number
          p2_done?: boolean
          p2_id?: string | null
          p2_name?: string | null
          p2_score?: number
          question_ids?: string[]
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          p1_answered?: number
          p1_done?: boolean
          p1_id?: string
          p1_name?: string
          p1_score?: number
          p2_answered?: number
          p2_done?: boolean
          p2_id?: string | null
          p2_name?: string | null
          p2_score?: number
          question_ids?: string[]
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      question_images: {
        Row: {
          caption: string | null
          created_at: string
          display_order: number
          id: string
          public_url: string
          question_id: string
          show_after_answer: boolean
          storage_path: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          public_url: string
          question_id: string
          show_after_answer?: boolean
          storage_path: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          public_url?: string
          question_id?: string
          show_after_answer?: boolean
          storage_path?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_duel: {
        Args: { p_id: string; p_match: string }
        Returns: undefined
      }
      find_duel: {
        Args: { p_id: string; p_name: string; p_questions: string[] }
        Returns: Database["public"]["Tables"]["duel_matches"]["Row"]
      }
      submit_duel_score: {
        Args: {
          p_answered: number
          p_done: boolean
          p_id: string
          p_match: string
          p_score: number
        }
        Returns: Database["public"]["Tables"]["duel_matches"]["Row"]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

// Tipo conveniente para uso no frontend
export type QuestionImageRow =
  Database["public"]["Tables"]["question_images"]["Row"];
