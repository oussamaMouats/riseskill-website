import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Role } from "@riseskill/shared";
import { PrismaService } from "../../prisma/prisma.service";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;

function getJwks() {
  if (!jwks) {
    const jwksUrl = process.env.SUPABASE_JWKS_URL;
    if (!jwksUrl) {
      throw new Error("SUPABASE_JWKS_URL must be set");
    }
    jwks = createRemoteJWKSet(new URL(jwksUrl));
  }
  return jwks;
}

/**
 * Verifies the Supabase-issued JWT (asymmetric, via JWKS) on the Authorization
 * header, then resolves the caller's role by looking up AdminProfile/StudentProfile
 * — riseskill has no role claim on the token itself, roles live in our own tables.
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    let payload: { sub?: string; email?: string };
    try {
      const result = await jwtVerify(token, getJwks(), {
        issuer: `${process.env.SUPABASE_URL}/auth/v1`,
        audience: "authenticated",
      });
      payload = result.payload;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }

    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException("Malformed token");
    }

    const role = await this.resolveRole(payload.sub);
    if (!role) {
      throw new UnauthorizedException("No riseskill profile for this account");
    }

    request.user = { id: payload.sub, email: payload.email, role };
    return true;
  }

  private extractToken(request: Request): string | undefined {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return undefined;
    }
    return header.slice("Bearer ".length);
  }

  private async resolveRole(userId: string): Promise<Role | null> {
    const admin = await this.prisma.adminProfile.findUnique({ where: { id: userId } });
    if (admin) return "ADMIN";

    const student = await this.prisma.studentProfile.findUnique({ where: { id: userId } });
    if (student) return "STUDENT";

    return null;
  }
}
