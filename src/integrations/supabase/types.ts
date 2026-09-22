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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      approvals: {
        Row: {
          approved_by: string | null
          approved_by_label: string | null
          comment: string | null
          context: string
          created_at: string
          decided_at: string | null
          id: string
          phase_id: string | null
          project_id: string | null
          requested_by: string | null
          requested_by_label: string
          status: Database["public"]["Enums"]["approval_status"]
          task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          approved_by_label?: string | null
          comment?: string | null
          context?: string
          created_at?: string
          decided_at?: string | null
          id?: string
          phase_id?: string | null
          project_id?: string | null
          requested_by?: string | null
          requested_by_label?: string
          status?: Database["public"]["Enums"]["approval_status"]
          task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          approved_by_label?: string | null
          comment?: string | null
          context?: string
          created_at?: string
          decided_at?: string | null
          id?: string
          phase_id?: string | null
          project_id?: string | null
          requested_by?: string | null
          requested_by_label?: string
          status?: Database["public"]["Enums"]["approval_status"]
          task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approvals_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approvals_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      checkpoints: {
        Row: {
          created_at: string
          critical: boolean
          id: string
          label: string
          next_step: string
          phase_id: string
          position: number
          state: Database["public"]["Enums"]["checkpoint_state"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          critical?: boolean
          id?: string
          label: string
          next_step?: string
          phase_id: string
          position?: number
          state?: Database["public"]["Enums"]["checkpoint_state"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          critical?: boolean
          id?: string
          label?: string
          next_step?: string
          phase_id?: string
          position?: number
          state?: Database["public"]["Enums"]["checkpoint_state"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkpoints_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          kind: string
          link: string | null
          read: boolean
          target_role: Database["public"]["Enums"]["app_role"]
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          target_role: Database["public"]["Enums"]["app_role"]
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          kind?: string
          link?: string | null
          read?: boolean
          target_role?: Database["public"]["Enums"]["app_role"]
          title?: string
        }
        Relationships: []
      }
      phases: {
        Row: {
          code: string
          created_at: string
          end_date: string | null
          id: string
          name: string
          position: number
          project_id: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          end_date?: string | null
          id?: string
          name: string
          position?: number
          project_id: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          end_date?: string | null
          id?: string
          name?: string
          position?: number
          project_id?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "phases_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          accent: string
          created_at: string
          id: string
          name: string
          position: number
          slug: string
          status: string
          summary: string
          updated_at: string
        }
        Insert: {
          accent?: string
          created_at?: string
          id?: string
          name: string
          position?: number
          slug: string
          status?: string
          summary?: string
          updated_at?: string
        }
        Update: {
          accent?: string
          created_at?: string
          id?: string
          name?: string
          position?: number
          slug?: string
          status?: string
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          created_at: string
          deadline: string | null
          id: string
          message: string
          phase_id: string | null
          priority: string
          project_id: string | null
          reply: string | null
          requested_by: string | null
          requested_by_role: Database["public"]["Enums"]["app_role"] | null
          requested_from: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["request_status"]
          task_id: string | null
          title: string
          type: Database["public"]["Enums"]["request_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deadline?: string | null
          id?: string
          message?: string
          phase_id?: string | null
          priority?: string
          project_id?: string | null
          reply?: string | null
          requested_by?: string | null
          requested_by_role?: Database["public"]["Enums"]["app_role"] | null
          requested_from: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["request_status"]
          task_id?: string | null
          title: string
          type?: Database["public"]["Enums"]["request_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deadline?: string | null
          id?: string
          message?: string
          phase_id?: string | null
          priority?: string
          project_id?: string | null
          reply?: string | null
          requested_by?: string | null
          requested_by_role?: Database["public"]["Enums"]["app_role"] | null
          requested_from?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["request_status"]
          task_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["request_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "requests_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_activity: {
        Row: {
          action: string
          actor_id: string | null
          actor_label: string
          created_at: string
          detail: string
          id: string
          task_id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_label?: string
          created_at?: string
          detail?: string
          id?: string
          task_id: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_label?: string
          created_at?: string
          detail?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_activity_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          checklist: Json
          created_at: string
          created_by: string | null
          deadline: string | null
          dependency: string
          description: string
          id: string
          notes: string
          phase_id: string | null
          priority: string
          project_id: string
          responsible: Database["public"]["Enums"]["app_role"] | null
          start_date: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string
          validation_criteria: string
        }
        Insert: {
          checklist?: Json
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          dependency?: string
          description?: string
          id?: string
          notes?: string
          phase_id?: string | null
          priority?: string
          project_id: string
          responsible?: Database["public"]["Enums"]["app_role"] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string
          validation_criteria?: string
        }
        Update: {
          checklist?: Json
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          dependency?: string
          description?: string
          id?: string
          notes?: string
          phase_id?: string | null
          priority?: string
          project_id?: string
          responsible?: Database["public"]["Enums"]["app_role"] | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
          validation_criteria?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      current_role_name: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "nany" | "amanda" | "pastor"
      approval_status: "pending" | "approved" | "rejected"
      checkpoint_state: "implemented" | "validated" | "pending" | "blocked"
      request_status: "pending" | "in_progress" | "answered" | "closed"
      request_type:
        | "information"
        | "document"
        | "access"
        | "decision"
        | "approval"
        | "material"
        | "contact"
      task_status:
        | "nao_iniciado"
        | "preparando"
        | "em_implementacao"
        | "aguardando"
        | "bloqueado"
        | "em_validacao"
        | "concluido"
        | "cancelado"
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
    Enums: {
      app_role: ["nany", "amanda", "pastor"],
      approval_status: ["pending", "approved", "rejected"],
      checkpoint_state: ["implemented", "validated", "pending", "blocked"],
      request_status: ["pending", "in_progress", "answered", "closed"],
      request_type: [
        "information",
        "document",
        "access",
        "decision",
        "approval",
        "material",
        "contact",
      ],
      task_status: [
        "nao_iniciado",
        "preparando",
        "em_implementacao",
        "aguardando",
        "bloqueado",
        "em_validacao",
        "concluido",
        "cancelado",
      ],
    },
  },
} as const
