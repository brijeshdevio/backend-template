import { Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse";
import { SessionService } from "./session.service";
import { UnauthorizedException } from "../../utils/errors";

export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  findAll = async (req: Request, res: Response) => {
    if (!req.user?.id) throw new UnauthorizedException();
    const sessions = await this.sessionService.findAll(req.user.id);
    return apiResponse(res, {
      status: 200,
      data: sessions,
    });
  };
}
