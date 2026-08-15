import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().min(1),

  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  // Asymmetric JWT verification (JWKS), not a shared HS256 secret.
  SUPABASE_JWKS_URL: z.string().url(),

  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1),

  COOKIE_SECRET: z.string().min(1),

  // Phase 4 only (RISE ERP integration) — optional until that module is wired up.
  ERP_SUPABASE_URL: z.string().url().optional(),
  ERP_SERVICE_KEY: z.string().optional(),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const parsed = EnvSchema.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.toString()}`);
  }
  return parsed.data;
}
