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
      artists: {
        Row: {
          bio: string | null
          country: string | null
          createdAt: string
          followersCount: number
          id: string
          images: Json
          joinedAt: string
          lastUpdatedAt: string
          tags: string[] | null
          tweetsCount: number
          url: string
          userId: string
          username: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          country?: string | null
          createdAt?: string
          followersCount: number
          id?: string
          images: Json
          joinedAt: string
          lastUpdatedAt?: string
          tags?: string[] | null
          tweetsCount: number
          url: string
          userId: string
          username: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          country?: string | null
          createdAt?: string
          followersCount?: number
          id?: string
          images?: Json
          joinedAt?: string
          lastUpdatedAt?: string
          tags?: string[] | null
          tweetsCount?: number
          url?: string
          userId?: string
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      artistsQueue: {
        Row: {
          country: string | null
          createdAt: string
          requestId: string
          requestStatus: string
          tags: string[] | null
          username: string
        }
        Insert: {
          country?: string | null
          createdAt?: string
          requestId?: string
          requestStatus?: string
          tags?: string[] | null
          username: string
        }
        Update: {
          country?: string | null
          createdAt?: string
          requestId?: string
          requestStatus?: string
          tags?: string[] | null
          username?: string
        }
        Relationships: []
      }
      artistsTrend: {
        Row: {
          followersCount: number
          recordedAt: string | null
          tweetsCount: number
          userId: string
        }
        Insert: {
          followersCount: number
          recordedAt?: string | null
          tweetsCount: number
          userId: string
        }
        Update: {
          followersCount?: number
          recordedAt?: string | null
          tweetsCount?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_artistsTrends_userId_fkey"
            columns: ["userId"]
            isOneToOne: true
            referencedRelation: "artists"
            referencedColumns: ["userId"]
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
