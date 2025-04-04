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
      bosc: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      BOSC: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      comments: {
        Row: {
          author: string
          author_name: string
          author_profile_pic: string | null
          content: string
          created_at: string
          dislikes: number | null
          id: string
          likes: number | null
          scammer_id: string | null
          views: number | null
        }
        Insert: {
          author: string
          author_name: string
          author_profile_pic?: string | null
          content: string
          created_at?: string
          dislikes?: number | null
          id: string
          likes?: number | null
          scammer_id?: string | null
          views?: number | null
        }
        Update: {
          author?: string
          author_name?: string
          author_profile_pic?: string | null
          content?: string
          created_at?: string
          dislikes?: number | null
          id?: string
          likes?: number | null
          scammer_id?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "deleted_scammers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_scammer_id_fkey"
            columns: ["scammer_id"]
            isOneToOne: false
            referencedRelation: "scammers"
            referencedColumns: ["id"]
          },
        ]
      }
      lawsuit_signatures: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          realised_losses: number | null
          residential_address: string
          terms_accepted: boolean
          unrealised_losses: number | null
          wallet_address: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          realised_losses?: number | null
          residential_address: string
          terms_accepted?: boolean
          unrealised_losses?: number | null
          wallet_address: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          realised_losses?: number | null
          residential_address?: string
          terms_accepted?: boolean
          unrealised_losses?: number | null
          wallet_address?: string
        }
        Relationships: []
      }
      leaderboard_stats: {
        Row: {
          id: string
          total_bounty: number | null
          total_comments: number | null
          total_likes: number | null
          total_reports: number | null
          total_views: number | null
          updated_at: string | null
          wallet_address: string
        }
        Insert: {
          id?: string
          total_bounty?: number | null
          total_comments?: number | null
          total_likes?: number | null
          total_reports?: number | null
          total_views?: number | null
          updated_at?: string | null
          wallet_address: string
        }
        Update: {
          id?: string
          total_bounty?: number | null
          total_comments?: number | null
          total_likes?: number | null
          total_reports?: number | null
          total_views?: number | null
          updated_at?: string | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_stats_wallet_address_fkey"
            columns: ["wallet_address"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["wallet_address"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          id: string
          profile_pic_url: string | null
          username: string | null
          wallet_address: string
          website_link: string | null
          x_link: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          profile_pic_url?: string | null
          username?: string | null
          wallet_address: string
          website_link?: string | null
          x_link?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          profile_pic_url?: string | null
          username?: string | null
          wallet_address?: string
          website_link?: string | null
          x_link?: string | null
        }
        Relationships: []
      }
      scammer_views: {
        Row: {
          id: string
          ip_hash: string
          scammer_id: string
          viewed_at: string | null
        }
        Insert: {
          id?: string
          ip_hash: string
          scammer_id: string
          viewed_at?: string | null
        }
        Update: {
          id?: string
          ip_hash?: string
          scammer_id?: string
          viewed_at?: string | null
        }
        Relationships: []
      }
      scammers: {
        Row: {
          accomplices: Json | null
          accused_of: string | null
          added_by: string | null
          aliases: Json | null
          bounty_amount: number | null
          comments: Json | null
          date_added: string
          deleted_at: string | null
          dislikes: number | null
          id: string
          likes: number | null
          links: Json | null
          name: string
          official_response: string | null
          photo_url: string | null
          shares: number | null
          views: number | null
          wallet_address: string | null
          x_link: string | null
        }
        Insert: {
          accomplices?: Json | null
          accused_of?: string | null
          added_by?: string | null
          aliases?: Json | null
          bounty_amount?: number | null
          comments?: Json | null
          date_added?: string
          deleted_at?: string | null
          dislikes?: number | null
          id: string
          likes?: number | null
          links?: Json | null
          name: string
          official_response?: string | null
          photo_url?: string | null
          shares?: number | null
          views?: number | null
          wallet_address?: string | null
          x_link?: string | null
        }
        Update: {
          accomplices?: Json | null
          accused_of?: string | null
          added_by?: string | null
          aliases?: Json | null
          bounty_amount?: number | null
          comments?: Json | null
          date_added?: string
          deleted_at?: string | null
          dislikes?: number | null
          id?: string
          likes?: number | null
          links?: Json | null
          name?: string
          official_response?: string | null
          photo_url?: string | null
          shares?: number | null
          views?: number | null
          wallet_address?: string | null
          x_link?: string | null
        }
        Relationships: []
      }
      user_comment_interactions: {
        Row: {
          comment_id: string
          disliked: boolean | null
          id: string
          last_updated: string | null
          liked: boolean | null
          user_id: string
        }
        Insert: {
          comment_id: string
          disliked?: boolean | null
          id?: string
          last_updated?: string | null
          liked?: boolean | null
          user_id: string
        }
        Update: {
          comment_id?: string
          disliked?: boolean | null
          id?: string
          last_updated?: string | null
          liked?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_comment_interactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_scammer_interactions: {
        Row: {
          disliked: boolean | null
          id: string
          last_updated: string | null
          liked: boolean | null
          scammer_id: string
          user_id: string
        }
        Insert: {
          disliked?: boolean | null
          id?: string
          last_updated?: string | null
          liked?: boolean | null
          scammer_id: string
          user_id: string
        }
        Update: {
          disliked?: boolean | null
          id?: string
          last_updated?: string | null
          liked?: boolean | null
          scammer_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      deleted_scammers: {
        Row: {
          accomplices: Json | null
          accused_of: string | null
          added_by: string | null
          aliases: Json | null
          bounty_amount: number | null
          comments: Json | null
          date_added: string | null
          deleted_at: string | null
          dislikes: number | null
          id: string | null
          likes: number | null
          links: Json | null
          name: string | null
          official_response: string | null
          photo_url: string | null
          shares: number | null
          views: number | null
          wallet_address: string | null
          x_link: string | null
        }
        Insert: {
          accomplices?: Json | null
          accused_of?: string | null
          added_by?: string | null
          aliases?: Json | null
          bounty_amount?: number | null
          comments?: Json | null
          date_added?: string | null
          deleted_at?: string | null
          dislikes?: number | null
          id?: string | null
          likes?: number | null
          links?: Json | null
          name?: string | null
          official_response?: string | null
          photo_url?: string | null
          shares?: number | null
          views?: number | null
          wallet_address?: string | null
          x_link?: string | null
        }
        Update: {
          accomplices?: Json | null
          accused_of?: string | null
          added_by?: string | null
          aliases?: Json | null
          bounty_amount?: number | null
          comments?: Json | null
          date_added?: string | null
          deleted_at?: string | null
          dislikes?: number | null
          id?: string | null
          likes?: number | null
          links?: Json | null
          name?: string | null
          official_response?: string | null
          photo_url?: string | null
          shares?: number | null
          views?: number | null
          wallet_address?: string | null
          x_link?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_signature_count: {
        Args: Record<PropertyKey, never>
        Returns: number
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
