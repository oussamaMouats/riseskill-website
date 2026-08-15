import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Request } from "express";
import { SupabaseAuthGuard, type AuthenticatedUser } from "../../common/guards/supabase-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  @Get("me")
  @UseGuards(SupabaseAuthGuard)
  me(@Req() request: Request & { user?: AuthenticatedUser }) {
    return request.user;
  }
}
