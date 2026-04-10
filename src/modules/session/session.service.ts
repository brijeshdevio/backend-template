import { prisma } from "../../lib/prisma";
import { ForbiddenException, NotFoundException } from "../../utils/errors";

export class SessionService {
  async findAll(userId: string) {
    return prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        type: true,
        deviceName: true,
        ipAddress: true,
        userAgent: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteOne(sessionId: string, userId: string) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    if (session.userId !== userId) {
      throw new ForbiddenException("Cannot delete another user's session");
    }

    // Cascade deletes the associated refresh token
    await prisma.session.delete({ where: { id: sessionId } });

    // Check if the user has any remaining sessions
    const remaining = await prisma.session.count({ where: { userId } });
    return { remaining };
  }

  async deleteAll(userId: string) {
    await prisma.session.deleteMany({ where: { userId } });
  }
}
