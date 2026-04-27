import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { UnauthorizedException } from "../../utils/error";
import { FindUsersQueryDto } from "./users.schema";
import { apiResponse } from "../../utils/api-response";

export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  findAllUsers = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    const query = req.validatedQuery as unknown as FindUsersQueryDto;

    const { users, meta } = await this.usersService.findAllUsers(
      user.id,
      query,
    );

    apiResponse(res, {
      data: users,
      meta,
    });
  };

  findOne = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    const userId = req.params.id as string;

    const data = await this.usersService.findOne(userId);

    apiResponse(res, { data });
  };

  updateOne = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    const userId = req.params.id as string;

    const data = await this.usersService.updateOne(userId, user.role, req.body);

    apiResponse(res, { data, message: "User updated successfully" });
  };

  deleteOne = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new UnauthorizedException();
    const userId = req.params.id as string;

    await this.usersService.deleteOne(userId);

    apiResponse(res, { message: "User deleted successfully" });
  };
}
