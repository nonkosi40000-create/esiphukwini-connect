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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_urgent: boolean | null
          target_grades: Database["public"]["Enums"]["grade_level"][] | null
          target_roles: Database["public"]["Enums"]["app_role"][]
          title: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          target_grades?: Database["public"]["Enums"]["grade_level"][] | null
          target_roles: Database["public"]["Enums"]["app_role"][]
          title: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          target_grades?: Database["public"]["Enums"]["grade_level"][] | null
          target_roles?: Database["public"]["Enums"]["app_role"][]
          title?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          class_id: string
          created_at: string
          date: string
          id: string
          is_present: boolean
          marked_by: string
          student_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          date: string
          id?: string
          is_present?: boolean
          marked_by: string
          student_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          date?: string
          id?: string
          is_present?: boolean
          marked_by?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          academic_year: number
          created_at: string
          current_count: number
          grade: Database["public"]["Enums"]["grade_level"]
          grade_head_id: string | null
          id: string
          max_capacity: number
          section: Database["public"]["Enums"]["class_section"]
        }
        Insert: {
          academic_year?: number
          created_at?: string
          current_count?: number
          grade: Database["public"]["Enums"]["grade_level"]
          grade_head_id?: string | null
          id?: string
          max_capacity?: number
          section: Database["public"]["Enums"]["class_section"]
        }
        Update: {
          academic_year?: number
          created_at?: string
          current_count?: number
          grade?: Database["public"]["Enums"]["grade_level"]
          grade_head_id?: string | null
          id?: string
          max_capacity?: number
          section?: Database["public"]["Enums"]["class_section"]
        }
        Relationships: []
      }
      content: {
        Row: {
          content_type: string
          created_at: string
          description: string | null
          due_date: string | null
          file_url: string | null
          id: string
          target_grades: Database["public"]["Enums"]["grade_level"][]
          target_subjects: string[] | null
          title: string
          uploaded_by: string
        }
        Insert: {
          content_type: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          target_grades: Database["public"]["Enums"]["grade_level"][]
          target_subjects?: string[] | null
          title: string
          uploaded_by: string
        }
        Update: {
          content_type?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          target_grades?: Database["public"]["Enums"]["grade_level"][]
          target_subjects?: string[] | null
          title?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      learner_registrations: {
        Row: {
          applying_for_grade: Database["public"]["Enums"]["grade_level"]
          assigned_grade: Database["public"]["Enums"]["grade_level"] | null
          assigned_section: Database["public"]["Enums"]["class_section"] | null
          banking_details_url: string
          created_at: string
          id: string
          parent_guardian_email: string | null
          parent_guardian_id_url: string
          parent_guardian_name: string
          parent_guardian_phone: string
          previous_grade: Database["public"]["Enums"]["grade_level"] | null
          previous_report_url: string
          student_number: string | null
          user_id: string
        }
        Insert: {
          applying_for_grade: Database["public"]["Enums"]["grade_level"]
          assigned_grade?: Database["public"]["Enums"]["grade_level"] | null
          assigned_section?: Database["public"]["Enums"]["class_section"] | null
          banking_details_url: string
          created_at?: string
          id?: string
          parent_guardian_email?: string | null
          parent_guardian_id_url: string
          parent_guardian_name: string
          parent_guardian_phone: string
          previous_grade?: Database["public"]["Enums"]["grade_level"] | null
          previous_report_url: string
          student_number?: string | null
          user_id: string
        }
        Update: {
          applying_for_grade?: Database["public"]["Enums"]["grade_level"]
          assigned_grade?: Database["public"]["Enums"]["grade_level"] | null
          assigned_section?: Database["public"]["Enums"]["class_section"] | null
          banking_details_url?: string
          created_at?: string
          id?: string
          parent_guardian_email?: string | null
          parent_guardian_id_url?: string
          parent_guardian_name?: string
          parent_guardian_phone?: string
          previous_grade?: Database["public"]["Enums"]["grade_level"] | null
          previous_report_url?: string
          student_number?: string | null
          user_id?: string
        }
        Relationships: []
      }
      marks: {
        Row: {
          academic_year: number
          assessment_name: string
          created_at: string
          feedback: string | null
          id: string
          marks_obtained: number
          percentage: number | null
          student_id: string
          subject_id: string
          teacher_id: string
          term: number
          total_marks: number
        }
        Insert: {
          academic_year?: number
          assessment_name: string
          created_at?: string
          feedback?: string | null
          id?: string
          marks_obtained: number
          percentage?: number | null
          student_id: string
          subject_id: string
          teacher_id: string
          term: number
          total_marks: number
        }
        Update: {
          academic_year?: number
          assessment_name?: string
          created_at?: string
          feedback?: string | null
          id?: string
          marks_obtained?: number
          percentage?: number | null
          student_id?: string
          subject_id?: string
          teacher_id?: string
          term?: number
          total_marks?: number
        }
        Relationships: [
          {
            foreignKeyName: "marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          meeting_date: string
          organizer_id: string
          target_grades: Database["public"]["Enums"]["grade_level"][] | null
          target_roles: Database["public"]["Enums"]["app_role"][]
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          meeting_date: string
          organizer_id: string
          target_grades?: Database["public"]["Enums"]["grade_level"][] | null
          target_roles: Database["public"]["Enums"]["app_role"][]
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          meeting_date?: string
          organizer_id?: string
          target_grades?: Database["public"]["Enums"]["grade_level"][] | null
          target_roles?: Database["public"]["Enums"]["app_role"][]
          title?: string
        }
        Relationships: []
      }
      merchandise: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          price: number
          stock_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          price: number
          stock_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          price?: number
          stock_count?: number
        }
        Relationships: []
      }
      merchandise_orders: {
        Row: {
          created_at: string
          id: string
          merchandise_id: string
          payment_proof_url: string | null
          processed_by: string | null
          quantity: number
          status: string
          student_id: string
          total_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          merchandise_id: string
          payment_proof_url?: string | null
          processed_by?: string | null
          quantity?: number
          status?: string
          student_id: string
          total_price: number
        }
        Update: {
          created_at?: string
          id?: string
          merchandise_id?: string
          payment_proof_url?: string | null
          processed_by?: string | null
          quantity?: number
          status?: string
          student_id?: string
          total_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "merchandise_orders_merchandise_id_fkey"
            columns: ["merchandise_id"]
            isOneToOne: false
            referencedRelation: "merchandise"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          message_type: string
          recipient_id: string
          sender_id: string
          subject: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string
          recipient_id: string
          sender_id: string
          subject: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          message_type?: string
          recipient_id?: string
          sender_id?: string
          subject?: string
        }
        Relationships: []
      }
      parent_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          parent_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          student_id: string
          subscribed_at: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          parent_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          student_id: string
          subscribed_at?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          parent_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          student_id?: string
          subscribed_at?: string | null
        }
        Relationships: []
      }
      past_papers: {
        Row: {
          created_at: string
          file_url: string
          grade: Database["public"]["Enums"]["grade_level"]
          id: string
          subject: string
          term: number | null
          title: string
          uploaded_by: string
          year: number
        }
        Insert: {
          created_at?: string
          file_url: string
          grade: Database["public"]["Enums"]["grade_level"]
          id?: string
          subject: string
          term?: number | null
          title: string
          uploaded_by: string
          year: number
        }
        Update: {
          created_at?: string
          file_url?: string
          grade?: Database["public"]["Enums"]["grade_level"]
          id?: string
          subject?: string
          term?: number | null
          title?: string
          uploaded_by?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number
          avatar_url: string | null
          backup_email: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          identity_document_url: string | null
          identity_number: string
          last_name: string
          next_of_kin_contact: string | null
          phone_number: string
          physical_address: string
          proof_of_address_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age: number
          avatar_url?: string | null
          backup_email?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          identity_document_url?: string | null
          identity_number: string
          last_name: string
          next_of_kin_contact?: string | null
          phone_number: string
          physical_address: string
          proof_of_address_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number
          avatar_url?: string | null
          backup_email?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          identity_document_url?: string | null
          identity_number?: string
          last_name?: string
          next_of_kin_contact?: string | null
          phone_number?: string
          physical_address?: string
          proof_of_address_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      staff_registrations: {
        Row: {
          created_at: string
          grades_teaching: Database["public"]["Enums"]["grade_level"][] | null
          id: string
          qualification_document_url: string
          staff_number: string | null
          subjects_teaching: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          grades_teaching?: Database["public"]["Enums"]["grade_level"][] | null
          id?: string
          qualification_document_url: string
          staff_number?: string | null
          subjects_teaching?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          grades_teaching?: Database["public"]["Enums"]["grade_level"][] | null
          id?: string
          qualification_document_url?: string
          staff_number?: string | null
          subjects_teaching?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      teacher_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          student_id: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          student_id: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          student_id?: string
          teacher_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          application_status: Database["public"]["Enums"]["application_status"]
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          application_status?: Database["public"]["Enums"]["application_status"]
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          application_status?: Database["public"]["Enums"]["application_status"]
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_staff_number: { Args: never; Returns: string }
      generate_student_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_principal: { Args: { _user_id: string }; Returns: boolean }
      is_grade_head: { Args: { _user_id: string }; Returns: boolean }
      is_principal: { Args: { _user_id: string }; Returns: boolean }
      is_sgb: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "learner"
        | "teacher"
        | "grade_head"
        | "principal"
        | "admin"
        | "sgb"
      application_status: "pending" | "accepted" | "rejected"
      class_section: "A" | "B" | "C"
      grade_level: "R" | "1" | "2" | "3" | "4" | "5" | "6" | "7"
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

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "learner",
        "teacher",
        "grade_head",
        "principal",
        "admin",
        "sgb",
      ],
      application_status: ["pending", "accepted", "rejected"],
      class_section: ["A", "B", "C"],
      grade_level: ["R", "1", "2", "3", "4", "5", "6", "7"],
    },
  },
} as const
