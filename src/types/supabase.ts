// src/types/supabase.ts
export type Database = {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: string;
            email: string;
            first_name: string | null;
            last_name: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id: string;
            email: string;
            first_name?: string | null;
            last_name?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            email?: string;
            first_name?: string | null;
            last_name?: string | null;
            created_at?: string;
            updated_at?: string;
          };
        };
        company_settings: {
          Row: {
            id: string;
            user_id: string;
            company_name: string | null;
            address: string | null;
            vat_number: string | null;
            website: string | null;
            email: string | null;
            phone_number: string | null;
            disclaimer: string | null;
            logo: string | null;
            created_at: string;
            updated_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            company_name?: string | null;
            address?: string | null;
            vat_number?: string | null;
            website?: string | null;
            email?: string | null;
            phone_number?: string | null;
            disclaimer?: string | null;
            logo?: string | null;
            created_at?: string;
            updated_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            company_name?: string | null;
            address?: string | null;
            vat_number?: string | null;
            website?: string | null;
            email?: string | null;
            phone_number?: string | null;
            disclaimer?: string | null;
            logo?: string | null;
            created_at?: string;
            updated_at?: string;
          };
        };
      };
    };
  };