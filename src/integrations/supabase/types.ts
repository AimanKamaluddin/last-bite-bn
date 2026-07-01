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
      admin_actions: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          notes: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          notes?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          allergen_info: string | null
          category: string
          created_at: string
          description: string | null
          discounted_price: number
          halal_info: string | null
          id: string
          image_url: string | null
          images: string[]
          merchant_id: string
          original_price: number
          pickup_end: string
          pickup_start: string
          quantity_available: number
          status: string
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          allergen_info?: string | null
          category: string
          created_at?: string
          description?: string | null
          discounted_price: number
          halal_info?: string | null
          id?: string
          image_url?: string | null
          images?: string[]
          merchant_id: string
          original_price: number
          pickup_end: string
          pickup_start: string
          quantity_available?: number
          status?: string
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          allergen_info?: string | null
          category?: string
          created_at?: string
          description?: string | null
          discounted_price?: number
          halal_info?: string | null
          id?: string
          image_url?: string | null
          images?: string[]
          merchant_id?: string
          original_price?: number
          pickup_end?: string
          pickup_start?: string
          quantity_available?: number
          status?: string
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "listings_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants_public"
            referencedColumns: ["id"]
          },
        ]
      }
      merchants: {
        Row: {
          address: string | null
          approval_status: string
          business_name: string
          business_reg_no: string | null
          business_type: string
          contact_person: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          district: string
          email: string | null
          halal_status: string
          id: string
          image_url: string | null
          instagram_url: string | null
          opening_hours: string | null
          phone: string | null
          rating: number | null
          tagline: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          approval_status?: string
          business_name: string
          business_reg_no?: string | null
          business_type: string
          contact_person?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          district: string
          email?: string | null
          halal_status?: string
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          opening_hours?: string | null
          phone?: string | null
          rating?: number | null
          tagline?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          approval_status?: string
          business_name?: string
          business_reg_no?: string | null
          business_type?: string
          contact_person?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          district?: string
          email?: string | null
          halal_status?: string
          id?: string
          image_url?: string | null
          instagram_url?: string | null
          opening_hours?: string | null
          phone?: string | null
          rating?: number | null
          tagline?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          commission_amount: number
          created_at: string
          id: string
          listing_id: string
          merchant_id: string
          merchant_payout: number
          payment_method: string
          payment_status: string
          pickup_code: string
          quantity: number
          status: string
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_amount: number
          created_at?: string
          id?: string
          listing_id: string
          merchant_id: string
          merchant_payout: number
          payment_method?: string
          payment_status?: string
          pickup_code: string
          quantity?: number
          status?: string
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_amount?: number
          created_at?: string
          id?: string
          listing_id?: string
          merchant_id?: string
          merchant_payout?: number
          payment_method?: string
          payment_status?: string
          pickup_code?: string
          quantity?: number
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants_public"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          merchant_id: string
          order_id: string | null
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          merchant_id: string
          order_id?: string | null
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          merchant_id?: string
          order_id?: string | null
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_merchants: {
        Row: {
          created_at: string
          id: string
          merchant_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          merchant_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          merchant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_merchants_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_merchants_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      merchants_public: {
        Row: {
          approval_status: string | null
          business_name: string | null
          business_type: string | null
          created_at: string | null
          description: string | null
          district: string | null
          halal_status: string | null
          id: string | null
          image_url: string | null
          opening_hours: string | null
          rating: number | null
        }
        Insert: {
          approval_status?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          halal_status?: string | null
          id?: string | null
          image_url?: string | null
          opening_hours?: string | null
          rating?: number | null
        }
        Update: {
          approval_status?: string | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          halal_status?: string | null
          id?: string | null
          image_url?: string | null
          opening_hours?: string | null
          rating?: number | null
        }
        Relationships: []
      }
      reviews_public: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string | null
          merchant_id: string | null
          rating: number | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string | null
          merchant_id?: string | null
          rating?: number | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string | null
          merchant_id?: string | null
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchants_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      admin_list_merchants: {
        Args: never
        Returns: {
          address: string | null
          approval_status: string
          business_name: string
          business_reg_no: string | null
          business_type: string
          contact_person: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          district: string
          email: string | null
          halal_status: string
          id: string
          image_url: string | null
          instagram_url: string | null
          opening_hours: string | null
          phone: string | null
          rating: number | null
          tagline: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "merchants"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_my_merchant: {
        Args: never
        Returns: {
          address: string | null
          approval_status: string
          business_name: string
          business_reg_no: string | null
          business_type: string
          contact_person: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          district: string
          email: string | null
          halal_status: string
          id: string
          image_url: string | null
          instagram_url: string | null
          opening_hours: string | null
          phone: string | null
          rating: number | null
          tagline: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "merchants"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      update_my_merchant_profile: {
        Args: {
          p_address?: string
          p_business_name: string
          p_business_type: string
          p_cover_image_url?: string
          p_description?: string
          p_district: string
          p_email?: string
          p_image_url?: string
          p_instagram_url?: string
          p_opening_hours?: string
          p_phone?: string
          p_tagline?: string
          p_website_url?: string
        }
        Returns: {
          address: string | null
          approval_status: string
          business_name: string
          business_reg_no: string | null
          business_type: string
          contact_person: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          district: string
          email: string | null
          halal_status: string
          id: string
          image_url: string | null
          instagram_url: string | null
          opening_hours: string | null
          phone: string | null
          rating: number | null
          tagline: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        SetofOptions: {
          from: "*"
          to: "merchants"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      app_role: "customer" | "merchant" | "admin"
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
      app_role: ["customer", "merchant", "admin"],
    },
  },
} as const
