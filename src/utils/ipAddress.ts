import { Request } from "express";

export const getIpAddress = (req: Request): string | undefined => {
  return (
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    (req.headers["x-real-ip"] as string) ||
    req.socket?.remoteAddress ||
    undefined
  );
};
