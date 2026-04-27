import { z } from "zod";

export const findUsersQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    search: z.string().trim().min(1).optional(),
    role: z.enum(["user", "admin"]).optional(),
  })
  .strict();

export type FindUsersQueryDto = z.infer<typeof findUsersQuerySchema>;

export const UpdateUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(64, "Password must be at most 64 characters long")
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.password !== undefined, {
    message: "At least one of 'name' or 'password' must be provided",
  })
  .strict();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
