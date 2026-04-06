import { z } from "zod";
import { passwordSchema } from "../../constants/auth";

export const RegisterSchema = z
  .object({
    name: z.string().min(3).max(30),
    email: z.email("Invalid email address"),
    password: passwordSchema,
  })
  .strict();

export const LoginSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
