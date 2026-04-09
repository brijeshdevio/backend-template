import { Router } from "express";
import { validateMiddleware } from "../../middleware/validate.middleware";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ChangePasswordSchema, UpdateSchema } from "./user.schema";

export const userRouter = Router();
const userController = new UserController(new UserService());

userRouter.get("/me", userController.findById);
userRouter.patch(
  "/me",
  validateMiddleware(UpdateSchema),
  userController.update,
);
userRouter.patch(
  "/change-password",
  validateMiddleware(ChangePasswordSchema),
  userController.changePassword,
);
