import { createClient } from "jsr:@supabase/supabase-js@2";

// Inicialización global de Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
        "No se encontraron las variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY",
    );
}

export const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
