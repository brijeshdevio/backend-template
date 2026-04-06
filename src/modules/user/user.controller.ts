import { Request, Response } from "express";
import { UserService } from "./user.service";
import { apiResponse } from "../../utils/apiResponse";
import { UnauthorizedException } from "../../utils/errors";
import { clearCookie } from "../../utils/cookie";

export class UserController {
  constructor(private readonly userService: UserService) {}

  findById = async (req: Request, res: Response) => {
    if (!req.user?.id) throw new UnauthorizedException();
    const user = await this.userService.findById(req.user.id);
    return apiResponse(res, {
      status: 200,
      data: user,
    });
  };

  update = async (req: Request, res: Response) => {
    if (!req.user?.id) throw new UnauthorizedException();
    const { name } = req.body;
    const user = await this.userService.update(req.user.id, { name });
    return apiResponse(res, {
      status: 200,
      data: user,
      message: "User updated successfully",
    });
  };

  changePassword = async (req: Request, res: Response) => {
    if (!req.user?.id) throw new UnauthorizedException();
    const { oldPassword, newPassword, confirmPassword } = req.body;
    await this.userService.changePassword(req.user.id, {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    clearCookie(res, "accessToken");
    clearCookie(res, "refreshToken");
    return apiResponse(res, {
      status: 200,
      message: "Password changed successfully",
    });
  };
}
