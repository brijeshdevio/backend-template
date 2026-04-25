import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { apiResponse } from "../../utils/api-response";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    const data = await this.authService.register(req.body);
    apiResponse(res, {
      status: 201,
      message: "User created successfully",
      data,
    });
  };
}
