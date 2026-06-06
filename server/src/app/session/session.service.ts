import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { ResponseEntity } from "../../common/responser/response.entity";
import { ResponseSender } from "../../common/responser/response.sender";

@Injectable()
export class SessionTokenService {
  constructor(private prisma: PrismaService) {}

  async listSessions(userId: string): Promise<ResponseEntity<any>> {
    const sessions = await this.prisma.sessionToken.findMany({
      where: { user_id: userId, revoked_at: null },
      include: { device: true },
      orderBy: { created_at: "desc" },
    });
    return ResponseSender.success(sessions, "Active sessions fetched");
  }

  async revokeSession(
    userId: string,
    sessionId: string,
  ): Promise<ResponseEntity<any>> {
    const session = await this.prisma.sessionToken.findFirst({
      where: { id: sessionId, user_id: userId },
    });
    if (!session) throw new NotFoundException("Session not found");
    await this.prisma.sessionToken.update({
      where: { id: sessionId },
      data: { revoked_at: new Date() },
    });
    return ResponseSender.success(null, "Session revoked");
  }

  async revokeAllExcept(
    userId: string,
    currentSessionId: string,
  ): Promise<ResponseEntity<any>> {
    await this.prisma.sessionToken.updateMany({
      where: {
        user_id: userId,
        id: { not: currentSessionId },
        revoked_at: null,
      },
      data: { revoked_at: new Date() },
    });
    return ResponseSender.success(null, "All other sessions revoked");
  }
}
