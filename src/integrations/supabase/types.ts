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
      booking_guests: {
        Row: {
          age_range_id: string
          booking_id: string
          created_at: string
          id: string
          label: string
          quantity: number
          unit_price: number
        }
        Insert: {
          age_range_id: string
          booking_id: string
          created_at?: string
          id?: string
          label: string
          quantity?: number
          unit_price?: number
        }
        Update: {
          age_range_id?: string
          booking_id?: string
          created_at?: string
          id?: string
          label?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_guests_age_range_id_fkey"
            columns: ["age_range_id"]
            isOneToOne: false
            referencedRelation: "experience_age_ranges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_guests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          created_at: string
          experience_id: string
          guests: number
          id: string
          message: string | null
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          tourist_id: string
          updated_at: string
        }
        Insert: {
          booking_date: string
          created_at?: string
          experience_id: string
          guests?: number
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price: number
          tourist_id: string
          updated_at?: string
        }
        Update: {
          booking_date?: string
          created_at?: string
          experience_id?: string
          guests?: number
          id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          tourist_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_age_ranges: {
        Row: {
          created_at: string
          experience_id: string
          id: string
          label: string
          max_age: number
          min_age: number
          position: number
          price: number
        }
        Insert: {
          created_at?: string
          experience_id: string
          id?: string
          label: string
          max_age?: number
          min_age?: number
          position?: number
          price?: number
        }
        Update: {
          created_at?: string
          experience_id?: string
          id?: string
          label?: string
          max_age?: number
          min_age?: number
          position?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "experience_age_ranges_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experience_photos: {
        Row: {
          created_at: string
          experience_id: string
          id: string
          position: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          experience_id: string
          id?: string
          position?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          experience_id?: string
          id?: string
          position?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "experience_photos_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      experiences: {
        Row: {
          capacity: number
          category: Database["public"]["Enums"]["experience_category"]
          created_at: string
          description: string
          duration: Database["public"]["Enums"]["experience_duration"]
          host_id: string
          id: string
          includes: string[] | null
          location: string
          price: number
          rating: number | null
          status: Database["public"]["Enums"]["experience_status"]
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number
          category: Database["public"]["Enums"]["experience_category"]
          created_at?: string
          description?: string
          duration?: Database["public"]["Enums"]["experience_duration"]
          host_id: string
          id?: string
          includes?: string[] | null
          location?: string
          price?: number
          rating?: number | null
          status?: Database["public"]["Enums"]["experience_status"]
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number
          category?: Database["public"]["Enums"]["experience_category"]
          created_at?: string
          description?: string
          duration?: Database["public"]["Enums"]["experience_duration"]
          host_id?: string
          id?: string
          includes?: string[] | null
          location?: string
          price?: number
          rating?: number | null
          status?: Database["public"]["Enums"]["experience_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          experience_id: string
          id: string
          tourist_id: string
        }
        Insert: {
          created_at?: string
          experience_id: string
          id?: string
          tourist_id: string
        }
        Update: {
          created_at?: string
          experience_id?: string
          id?: string
          tourist_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string
          experience_id: string
          id: string
          rating: number
          tourist_id: string
          tourist_name: string
        }
        Insert: {
          comment?: string
          created_at?: string
          experience_id: string
          id?: string
          rating: number
          tourist_id: string
          tourist_name?: string
        }
        Update: {
          comment?: string
          created_at?: string
          experience_id?: string
          id?: string
          rating?: number
          tourist_id?: string
          tourist_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_experience_id_fkey"
            columns: ["experience_id"]
            isOneToOne: false
            referencedRelation: "experiences"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string | null
          created_at: string
          description: string
          id: string
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          booking_id?: string | null
          created_at?: string
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
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
      become_host: { Args: { _user_id: string }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "turista" | "hospedeiro" | "admin"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      experience_category:
        | "Hospedagem"
        | "Trilhas"
        | "Gastronomia"
        | "Bike Tour"
        | "Ecoturismo"
        | "Camping"
        | "Cavalgada"
        | "aventura"
        | "agroturismo"
        | "retiro_bem_estar"
        | "pesca_esportiva"
        | "Aventura"
        | "Agroturismo"
        | "Retiro/Bem-estar"
        | "Pesca Esportiva"
      experience_duration:
        | "meio-dia"
        | "dia-inteiro"
        | "diaria"
        | "fim-de-semana"
        | "personalizado"
      experience_status: "draft" | "pending" | "active" | "inactive"
      transaction_status: "pending" | "completed" | "failed"
      transaction_type: "payment" | "commission" | "payout"
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
      app_role: ["turista", "hospedeiro", "admin"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      experience_category: [
        "Hospedagem",
        "Trilhas",
        "Gastronomia",
        "Bike Tour",
        "Ecoturismo",
        "Camping",
        "Cavalgada",
        "aventura",
        "agroturismo",
        "retiro_bem_estar",
        "pesca_esportiva",
        "Aventura",
        "Agroturismo",
        "Retiro/Bem-estar",
        "Pesca Esportiva",
      ],
      experience_duration: [
        "meio-dia",
        "dia-inteiro",
        "diaria",
        "fim-de-semana",
        "personalizado",
      ],
      experience_status: ["draft", "pending", "active", "inactive"],
      transaction_status: ["pending", "completed", "failed"],
      transaction_type: ["payment", "commission", "payout"],
    },
  },
} as const
