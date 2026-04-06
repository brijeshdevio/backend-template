import { z } from "zod";

export const TOKEN_EXPIRY = {
  /** Access token JWT lifetime string (15 minutes) */
  ACCESS_TOKEN_JWT: "15m",
  /** Access token cookie max-age in ms (15 minutes) */
  ACCESS_TOKEN_MS: 15 * 60 * 1000,
  /** Refresh token lifetime in ms (1 day) */
  REFRESH_TOKEN_MS: 24 * 60 * 60 * 1000,
  /** Session lifetime in ms (7 days) */
  SESSION_MS: 7 * 24 * 60 * 60 * 1000,
} as const;

/** Shared password validation schema — use in all password fields for consistency */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters");
