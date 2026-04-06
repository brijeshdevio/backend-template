import { z } from "zod";
import { passwordSchema } from "../../constants/auth";

export const UpdateSchema = z
  .object({
    name: z.string().min(3).max(30),
  })
  .strict();

export type UpdateDto = z.infer<typeof UpdateSchema>;

export const ChangePasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
      });
    }

    if (data.newPassword === data.oldPassword) {
      ctx.addIssue({
        path: ["newPassword"],
        code: z.ZodIssueCode.custom,
        message: "New password must be different from old password",
      });
    }
  })
  .strict();

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
