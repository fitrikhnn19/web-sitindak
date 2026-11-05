export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      assessment_questions: {
        Row: {
          assessment_id: string
          created_at: string
          id: string
          order_index: number
          question_id: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          id?: string
          order_index?: number
          question_id: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          id?: string
          order_index?: number
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessment_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          class_id: string
          closes_at: string
          created_at: string
          duration_minutes: number
          id: string
          is_token_active: boolean
          max_uses: number
          opens_at: string
          status: string
          teacher_id: string
          title: string
          token_code: string
          updated_at: string
          used_count: number
        }
        Insert: {
          class_id: string
          closes_at: string
          created_at?: string
          duration_minutes?: number
          id?: string
          is_token_active?: boolean
          max_uses?: number
          opens_at: string
          status?: string
          teacher_id: string
          title: string
          token_code: string
          updated_at?: string
          used_count?: number
        }
        Update: {
          class_id?: string
          closes_at?: string
          created_at?: string
          duration_minutes?: number
          id?: string
          is_token_active?: boolean
          max_uses?: number
          opens_at?: string
          status?: string
          teacher_id?: string
          title?: string
          token_code?: string
          updated_at?: string
          used_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cheating_logs: {
        Row: {
          assessment_id: string
          detail: string | null
          duration_seconds: number | null
          event_label: string
          event_type: string
          id: string
          occurred_at: string
          question_number: number | null
          severity: string
          student_name: string
          submission_id: string | null
        }
        Insert: {
          assessment_id: string
          detail?: string | null
          duration_seconds?: number | null
          event_label: string
          event_type: string
          id?: string
          occurred_at?: string
          question_number?: number | null
          severity?: string
          student_name: string
          submission_id?: string | null
        }
        Update: {
          assessment_id?: string
          detail?: string | null
          duration_seconds?: number | null
          event_label?: string
          event_type?: string
          id?: string
          occurred_at?: string
          question_number?: number | null
          severity?: string
          student_name?: string
          submission_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cheating_logs_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cheating_logs_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "student_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year: string | null
          created_at: string
          description: string | null
          grade_level: string
          id: string
          name: string
          teacher_id: string
          total_students: number
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          created_at?: string
          description?: string | null
          grade_level: string
          id?: string
          name: string
          teacher_id: string
          total_students?: number
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          created_at?: string
          description?: string | null
          grade_level?: string
          id?: string
          name?: string
          teacher_id?: string
          total_students?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          nip: string | null
          school_name: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string
          id: string
          nip?: string | null
          school_name?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          nip?: string | null
          school_name?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          created_at: string
          explanation: string
          id: string
          image_url: string | null
          is_public: boolean | null
          prerequisite_topic: string
          svg_diagram: string | null
          teacher_id: string | null
          tier1_options: Json
          tier1_question: string
          tier2_options: Json
          tier2_question: string
          tier3_prompt: string
          title: string
          topic: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          explanation?: string
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          prerequisite_topic: string
          svg_diagram?: string | null
          teacher_id?: string | null
          tier1_options: Json
          tier1_question: string
          tier2_options: Json
          tier2_question: string
          tier3_prompt?: string
          title: string
          topic?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          explanation?: string
          id?: string
          image_url?: string | null
          is_public?: boolean | null
          prerequisite_topic?: string
          svg_diagram?: string | null
          teacher_id?: string | null
          tier1_options?: Json
          tier1_question?: string
          tier2_options?: Json
          tier2_question?: string
          tier3_prompt?: string
          title?: string
          topic?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_answers: {
        Row: {
          conception_status: string | null
          created_at: string
          id: string
          is_t1_correct: boolean | null
          is_t2_correct: boolean | null
          question_id: string
          submission_id: string
          tier1_answer: string | null
          tier2_reason: string | null
          tier3_confidence: string | null
        }
        Insert: {
          conception_status?: string | null
          created_at?: string
          id?: string
          is_t1_correct?: boolean | null
          is_t2_correct?: boolean | null
          question_id: string
          submission_id: string
          tier1_answer?: string | null
          tier2_reason?: string | null
          tier3_confidence?: string | null
        }
        Update: {
          conception_status?: string | null
          created_at?: string
          id?: string
          is_t1_correct?: boolean | null
          is_t2_correct?: boolean | null
          question_id?: string
          submission_id?: string
          tier1_answer?: string | null
          tier2_reason?: string | null
          tier3_confidence?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "student_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      student_submissions: {
        Row: {
          assessment_id: string
          belum_paham_count: number | null
          created_at: string
          duration_minutes: number | null
          id: string
          miskonsepsi_count: number | null
          paham_count: number | null
          started_at: string
          status: string
          student_identifier: string | null
          student_name: string
          submitted_at: string | null
          total_score: number | null
        }
        Insert: {
          assessment_id: string
          belum_paham_count?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          miskonsepsi_count?: number | null
          paham_count?: number | null
          started_at?: string
          status?: string
          student_identifier?: string | null
          student_name: string
          submitted_at?: string | null
          total_score?: number | null
        }
        Update: {
          assessment_id?: string
          belum_paham_count?: number | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          miskonsepsi_count?: number | null
          paham_count?: number | null
          started_at?: string
          status?: string
          student_identifier?: string | null
          student_name?: string
          submitted_at?: string | null
          total_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_submissions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
