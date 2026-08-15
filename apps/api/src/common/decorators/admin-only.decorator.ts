import { UseGuards, applyDecorators } from "@nestjs/common";
import { RolesGuard } from "../guards/roles.guard";
import { SupabaseAuthGuard } from "../guards/supabase-auth.guard";
import { Roles } from "./roles.decorator";

export function AdminOnly() {
  return applyDecorators(UseGuards(SupabaseAuthGuard, RolesGuard), Roles("ADMIN"));
}
