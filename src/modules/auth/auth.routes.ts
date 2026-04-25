import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { validate } from "../../middleware/validate";
import { RegisterSchema } from "./auth.schema";

export const authRoutes = Router();

const controllers = new AuthController(new AuthService());
authRoutes.post("/register", validate(RegisterSchema), controllers.register);
