import { Request, Response, NextFunction } from "express";
import { ZodError, ZodIssue } from "zod";
import { apiResponse } from "../utils/api-response";
import { ERROR_CODES } from "../constants";
import { BadRequestException, HttpException } from "../utils/error";

const formatZodError = (issues: ZodIssue[]) => {
  return issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    throw new BadRequestException(
      "Validation Error",
      formatZodError(err.issues),
    );
  }

  if (err instanceof HttpException) {
    return apiResponse(res, err.toResponse());
  }

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
