import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export function validate<T extends z.ZodTypeAny>(
  schema: T,
  type: "body" | "query" | "params" = "body",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[type]);
      req[type] = parsed;
      next();
    } catch (err) {
      next(err);
    }
  };
}
