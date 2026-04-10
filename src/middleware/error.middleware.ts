import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import { apiResponse } from "../utils/apiResponse";
import { ERROR_CODES } from "../constants";
import { HttpException } from "../utils/errors";
import { logger } from "../lib/logger";

const formatZodError = (issues: ZodIssue[]) => {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

/**
 * Global error handler for Express
 */
export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ✅ Zod validation error
  if (err instanceof ZodError) {
    return apiResponse(res, {
      success: false,
      status: 400,
      message: "Validation Error",
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        details: formatZodError(err.issues),
      },
    });
  }

  // Custom HTTP exceptions
  if (err instanceof HttpException) {
    return apiResponse(res, err.toResponse());
  }

  // Fallback (unknown error) — log and return generic message
  logger.error(
    { err, requestId: req.id, method: req.method, url: req.originalUrl },
    "Unhandled error",
  );

  apiResponse(res, {
    success: false,
    status: 500,
    message: "Something went wrong",
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      details:
        process.env.NODE_ENV === "development"
          ? err instanceof Error
            ? { message: err.message, stack: err.stack }
            : String(err)
          : undefined,
    },
  });
};

