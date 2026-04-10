import { Request, Response } from "express";
import { apiResponse } from "../../utils/apiResponse";
import { SessionService } from "./session.service";
import { UnauthorizedException } from "../../utils/errors";
import { clearCookie } from "../../utils/cookie";

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

  deleteOne = async (req: Request, res: Response) => {
    if (!req.user?.id) throw new UnauthorizedException();
    const { id } = req.params;
    const { remaining } = await this.sessionService.deleteOne(id, req.user.id);

    // If no sessions remain, clear auth cookies (auto-logout)
    if (remaining === 0) {
      clearCookie(res, "accessToken");
      clearCookie(res, "refreshToken");
    }

    return apiResponse(res, {
      status: 200,
      message:
        remaining === 0
          ? "Session deleted. No active sessions remaining — logged out."
          : "Session deleted successfully",
    });
  };

  deleteAll = async (req: Request, res: Response) => {
    if (!req.user?.id) throw new UnauthorizedException();
    await this.sessionService.deleteAll(req.user.id);
    clearCookie(res, "accessToken");
    clearCookie(res, "refreshToken");
    return apiResponse(res, {
      status: 200,
      message: "All sessions deleted — logged out.",
    });
  };
}
