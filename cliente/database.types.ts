export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      carrera: {
        Row: {
          cod_facultad: number | null
          created_at: string
          id_carrera: number
          nombre: string
        }
        Insert: {
          cod_facultad?: number | null
          created_at?: string
          id_carrera?: number
          nombre: string
        }
        Update: {
          cod_facultad?: number | null
          created_at?: string
          id_carrera?: number
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "carrera_cod_facultad_fkey"
            columns: ["cod_facultad"]
            isOneToOne: false
            referencedRelation: "facultad"
            referencedColumns: ["id_facultad"]
          },
        ]
      }
      docente: {
        Row: {
          created_at: string
          id_docente: number
          nombre: string
        }
        Insert: {
          created_at?: string
          id_docente?: number
          nombre: string
        }
        Update: {
          created_at?: string
          id_docente?: number
          nombre?: string
        }
        Relationships: []
      }
      facultad: {
        Row: {
          created_at: string
          id_facultad: number
          nombre: string
          nombre_siglas: string | null
        }
        Insert: {
          created_at?: string
          id_facultad?: number
          nombre: string
          nombre_siglas?: string | null
        }
        Update: {
          created_at?: string
          id_facultad?: number
          nombre?: string
          nombre_siglas?: string | null
        }
        Relationships: []
      }
      horario: {
        Row: {
          anio_fin: number
          anio_inicio: number
          cod_carrera: number
          cod_periodo: string | null
          created_at: string
          id_horario: number
          pao: number
          paralelo: number
          url: string | null
        }
        Insert: {
          anio_fin: number
          anio_inicio: number
          cod_carrera: number
          cod_periodo?: string | null
          created_at?: string
          id_horario?: number
          pao: number
          paralelo: number
          url?: string | null
        }
        Update: {
          anio_fin?: number
          anio_inicio?: number
          cod_carrera?: number
          cod_periodo?: string | null
          created_at?: string
          id_horario?: number
          pao?: number
          paralelo?: number
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "horario_cod_carrera_fkey"
            columns: ["cod_carrera"]
            isOneToOne: false
            referencedRelation: "carrera"
            referencedColumns: ["id_carrera"]
          },
        ]
      }
      horario_materia: {
        Row: {
          cod_horario: number | null
          cod_materia: number
          created_at: string
          hora_fin: number
          hora_inicio: number
          id_horario_materia: number
          numero_dia: number
          paralelo: number
        }
        Insert: {
          cod_horario?: number | null
          cod_materia: number
          created_at?: string
          hora_fin: number
          hora_inicio: number
          id_horario_materia?: number
          numero_dia: number
          paralelo: number
        }
        Update: {
          cod_horario?: number | null
          cod_materia?: number
          created_at?: string
          hora_fin?: number
          hora_inicio?: number
          id_horario_materia?: number
          numero_dia?: number
          paralelo?: number
        }
        Relationships: [
          {
            foreignKeyName: "horario_materia_cod_horario_fkey"
            columns: ["cod_horario"]
            isOneToOne: false
            referencedRelation: "horario"
            referencedColumns: ["id_horario"]
          },
          {
            foreignKeyName: "horario_materia_cod_materia_fkey"
            columns: ["cod_materia"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id_materia"]
          },
        ]
      }
      malla_curricular: {
        Row: {
          anio_aprobacion: number
          cod_carrera: number
          created_at: string
          id_malla_curricular: number
          url: string
        }
        Insert: {
          anio_aprobacion: number
          cod_carrera: number
          created_at?: string
          id_malla_curricular?: number
          url: string
        }
        Update: {
          anio_aprobacion?: number
          cod_carrera?: number
          created_at?: string
          id_malla_curricular?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "malla_curricular_cod_carrera_fkey"
            columns: ["cod_carrera"]
            isOneToOne: false
            referencedRelation: "carrera"
            referencedColumns: ["id_carrera"]
          },
        ]
      }
      materia: {
        Row: {
          cod_carrera: number
          cod_docente: number | null
          cod_malla: number | null
          codigo: string
          created_at: string
          id_materia: number
          nombre: string
          numero_creditos: number
          pao: number
        }
        Insert: {
          cod_carrera: number
          cod_docente?: number | null
          cod_malla?: number | null
          codigo: string
          created_at?: string
          id_materia?: number
          nombre: string
          numero_creditos: number
          pao: number
        }
        Update: {
          cod_carrera?: number
          cod_docente?: number | null
          cod_malla?: number | null
          codigo?: string
          created_at?: string
          id_materia?: number
          nombre?: string
          numero_creditos?: number
          pao?: number
        }
        Relationships: [
          {
            foreignKeyName: "materia_cod_carrera_fkey"
            columns: ["cod_carrera"]
            isOneToOne: false
            referencedRelation: "carrera"
            referencedColumns: ["id_carrera"]
          },
          {
            foreignKeyName: "materia_cod_docente_fkey"
            columns: ["cod_docente"]
            isOneToOne: false
            referencedRelation: "docente"
            referencedColumns: ["id_docente"]
          },
        ]
      }
      materia_cambio_creditos: {
        Row: {
          cod_materia: number
          cod_redisenio: number
          created_at: string
          creditos: number
          id: number
        }
        Insert: {
          cod_materia: number
          cod_redisenio: number
          created_at?: string
          creditos: number
          id?: number
        }
        Update: {
          cod_materia?: number
          cod_redisenio?: number
          created_at?: string
          creditos?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "materia_cambio_creditos_cod_materia_fkey"
            columns: ["cod_materia"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id_materia"]
          },
          {
            foreignKeyName: "materia_cambio_creditos_cod_redisenio_fkey"
            columns: ["cod_redisenio"]
            isOneToOne: false
            referencedRelation: "redisenio"
            referencedColumns: ["id"]
          },
        ]
      }
      materia_cambio_pao: {
        Row: {
          cod_materia: number
          cod_redisenio: number
          created_at: string
          id: number
          pao: number
        }
        Insert: {
          cod_materia: number
          cod_redisenio: number
          created_at?: string
          id?: number
          pao: number
        }
        Update: {
          cod_materia?: number
          cod_redisenio?: number
          created_at?: string
          id?: number
          pao?: number
        }
        Relationships: [
          {
            foreignKeyName: "materia_cambio_pao_cod_materia_fkey"
            columns: ["cod_materia"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id_materia"]
          },
          {
            foreignKeyName: "materia_cambio_pao_cod_redisenio_fkey"
            columns: ["cod_redisenio"]
            isOneToOne: false
            referencedRelation: "redisenio"
            referencedColumns: ["id"]
          },
        ]
      }
      materia_convalidacion: {
        Row: {
          cod_materia: number
          cod_materia_convalida: number | null
          cod_redisenio: number
          created_at: string
          id: number
          pao_requerido: number | null
        }
        Insert: {
          cod_materia: number
          cod_materia_convalida?: number | null
          cod_redisenio: number
          created_at?: string
          id?: number
          pao_requerido?: number | null
        }
        Update: {
          cod_materia?: number
          cod_materia_convalida?: number | null
          cod_redisenio?: number
          created_at?: string
          id?: number
          pao_requerido?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "materia_convalidacion_cod_materia_convalida_fkey"
            columns: ["cod_materia_convalida"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id_materia"]
          },
          {
            foreignKeyName: "materia_convalidacion_cod_materia_fkey"
            columns: ["cod_materia"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id_materia"]
          },
          {
            foreignKeyName: "materia_convalidacion_cod_redisenio_fkey"
            columns: ["cod_redisenio"]
            isOneToOne: false
            referencedRelation: "redisenio"
            referencedColumns: ["id"]
          },
        ]
      }
      materia_eliminada: {
        Row: {
          cod_materia: number
          cod_redisenio: number
          created_at: string
          id: number
        }
        Insert: {
          cod_materia: number
          cod_redisenio: number
          created_at?: string
          id?: number
        }
        Update: {
          cod_materia?: number
          cod_redisenio?: number
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "materia_eliminada_cod_materia_fkey"
            columns: ["cod_materia"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id_materia"]
          },
          {
            foreignKeyName: "materia_eliminada_cod_redisenio_fkey"
            columns: ["cod_redisenio"]
            isOneToOne: false
            referencedRelation: "redisenio"
            referencedColumns: ["id"]
          },
        ]
      }
      materia_nueva: {
        Row: {
          cod_materia: number
          cod_redisenio: number
          created_at: string
          id: number
        }
        Insert: {
          cod_materia: number
          cod_redisenio: number
          created_at?: string
          id?: number
        }
        Update: {
          cod_materia?: number
          cod_redisenio?: number
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "materia_nueva_cod_materia_fkey"
            columns: ["cod_materia"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id_materia"]
          },
          {
            foreignKeyName: "materia_nueva_cod_redisenio_fkey"
            columns: ["cod_redisenio"]
            isOneToOne: false
            referencedRelation: "redisenio"
            referencedColumns: ["id"]
          },
        ]
      }
      prerequisito_materia: {
        Row: {
          cod_materia: number
          cod_materia_requisito: number | null
          created_at: string
          id_prerequisito: number
        }
        Insert: {
          cod_materia: number
          cod_materia_requisito?: number | null
          created_at?: string
          id_prerequisito?: number
        }
        Update: {
          cod_materia?: number
          cod_materia_requisito?: number | null
          created_at?: string
          id_prerequisito?: number
        }
        Relationships: [
          {
            foreignKeyName: "prerequisito_materia_cod_materia_fkey"
            columns: ["cod_materia"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id_materia"]
          },
          {
            foreignKeyName: "prerequisito_materia_cod_materia_requisito_fkey"
            columns: ["cod_materia_requisito"]
            isOneToOne: false
            referencedRelation: "materia"
            referencedColumns: ["id_materia"]
          },
        ]
      }
      redisenio: {
        Row: {
          anio: number
          cod_carrera: number
          created_at: string
          hash_md5: string
          id: number
        }
        Insert: {
          anio: number
          cod_carrera: number
          created_at?: string
          hash_md5: string
          id?: number
        }
        Update: {
          anio?: number
          cod_carrera?: number
          created_at?: string
          hash_md5?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "redisenio_cod_carrera_fkey"
            columns: ["cod_carrera"]
            isOneToOne: false
            referencedRelation: "carrera"
            referencedColumns: ["id_carrera"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_prerequisitos: {
        Args: {
          p_codigo_materia: number
          codigos_requisito: string[]
        }
        Returns: {
          codigo_materia: number
          codigo_materia_requisito: number
        }[]
      }
      find_or_create_carrera:
        | {
            Args: {
              carrera_nombre: string
              id_facultad: number
            }
            Returns: number
          }
        | {
            Args: {
              materia_nombre: string
              codigo_materia: string
              codigo_carrera: string
              anio_malla: number
              pao: number
              numero_creditos: number
            }
            Returns: number
          }
      find_or_create_facultad: {
        Args: {
          facultad_nombre: string
        }
        Returns: number
      }
      find_or_create_horario: {
        Args: {
          cod_carrera: number
          pao: number
          paralelo: number
          anio_inicio: number
          anio_fin: number
          cod_periodo: string
        }
        Returns: number
      }
      find_or_create_materia: {
        Args: {
          materia_nombre: string
          codigo_materia: string
          codigo_carrera: number
          anio_malla: number
          numero_pao: number
          cantidad_creditos: number
        }
        Returns: number
      }
      find_or_create_materia2: {
        Args: {
          materia_nombre: string
          codigo_materia: string
          codigo_carrera: number
          anio_malla: number
          numero_pao: number
          cantidad_creditos: number
        }
        Returns: number
      }
      get_carrera_id: {
        Args: {
          nombre_carrera: string
        }
        Returns: number
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      unaccent: {
        Args: {
          "": string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          "": unknown
        }
        Returns: unknown
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

