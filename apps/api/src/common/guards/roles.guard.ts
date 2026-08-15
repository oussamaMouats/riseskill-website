import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Role } from "@riseskill/shared";
import { ROLES_KEY } from "../decorators/roles.decorator";

interface RequestWithUser {
  user?: { role: Role };
}

/**
 * Not wired globally — apply per-route as @UseGuards(SupabaseAuthGuard, RolesGuard)
 * alongside @Roles(...); SupabaseAuthGuard must run first to populate request.user.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    return !!user && requiredRoles.includes(user.role);
  }
}
