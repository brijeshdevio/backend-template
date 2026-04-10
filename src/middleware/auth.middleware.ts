import type { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/errors";
import { verifyJwt } from "../lib/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Prefer cookie, fall back to Authorization: Bearer header
  const token =
    req.cookies?.["accessToken"] ||
    req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new UnauthorizedException("Missing access token");
  }

  try {
    const payload = verifyJwt(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    throw new UnauthorizedException("Invalid access token");
  }
}
