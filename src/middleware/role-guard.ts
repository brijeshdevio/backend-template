import type { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { ForbiddenException, UnauthorizedException } from "../utils/error";
import { env } from "../config/env";
import { Role } from "../generated/prisma/enums";

export function roleGuard(roles: Role[]) {
  return function (req: Request, res: Response, next: NextFunction) {
    const role = req.user?.role as Role;

    if (!role || !roles.includes(role)) {
      return next(
        new ForbiddenException(
          "You do not have permission to access this resource",
        ),
      );
    }
    next();
  };
}
