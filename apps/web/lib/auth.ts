import { redirect } from "next/navigation";
import type { Role } from "@riseskill/shared";
import { createSupabaseServerClient } from "./supabase/server";

export interface Session {
  userId: string;
  email: string;
  role: Role;
  accessToken: string;
}

// Role isn't a JWT claim — it lives in AdminProfile/StudentProfile, so we ask
// our own backend (the only thing with DB access) to resolve it.
export async function getSession(): Promise<Session | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${apiUrl}/api/auth/me`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    return null;
  }
  const me = (await res.json()) as { id: string; email: string; role: Role };

  return { userId: me.id, email: me.email, role: me.role, accessToken: session.access_token };
}

export async function requireRole(role: Role): Promise<Session> {
  const session = await getSession();
  if (!session || session.role !== role) {
    redirect("/login");
  }
  return session;
}
