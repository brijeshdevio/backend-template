import { Router } from "express";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { roleGuard } from "../../middleware/role-guard";
import { validate } from "../../middleware/validate";
import { findUsersQuerySchema } from "./users.schema";

export const userRoutes = Router();
const controllers = new UsersController(new UsersService());

userRoutes.get(
  "/",
  roleGuard(["admin"]),
  validate(findUsersQuerySchema, "query"),
  controllers.findAllUsers,
);
userRoutes.get("/:id", controllers.findOne);
userRoutes.put("/:id", roleGuard(["admin", "user"]), controllers.updateOne);
userRoutes.delete("/:id", roleGuard(["admin"]), controllers.deleteOne);
