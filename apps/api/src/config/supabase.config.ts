import { registerAs } from "@nestjs/config";
import { createClient } from "@supabase/supabase-js";

export const supabaseConfig = registerAs("supabase", () => ({
  url: process.env.SUPABASE_URL,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  jwksUrl: process.env.SUPABASE_JWKS_URL,
}));

/**
 * Admin client using the service_role key. Reserved for Supabase Auth operations
 * (JWT verification, user invites/admin actions) — never for data CRUD, which always
 * goes through Prisma repositories per the architecture's layering rule.
 */
export function createSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
