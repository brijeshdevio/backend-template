import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env";
import { TOKEN_EXPIRY } from "../constants/auth";

const JwtPayloadSchema = z.object({
  sub: z.string(),
  iat: z.number(),
  exp: z.number(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const signJwt = (payload: Record<string, unknown>): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN_JWT,
  });
};

export const verifyJwt = (token: string): JwtPayload => {
  const raw = jwt.verify(token, env.JWT_SECRET);
  return JwtPayloadSchema.parse(raw);
};
