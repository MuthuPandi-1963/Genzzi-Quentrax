import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { type Response } from "express";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SessionTokenService } from "./session.service";

@Controller("sessions")
@UseGuards(JwtAuthGuard)
export class SessionTokenController {
  constructor(private readonly sessionService: SessionTokenService) {}

  @Get()
  async list(@CurrentUser("id") userId: string, @Res() res: Response) {
    const { statusCode, ...response } =
      await this.sessionService.listSessions(userId);
    res.status(statusCode).json(response);
  }

  @Delete(":id")
  async revoke(
    @Param("id") id: string,
    @CurrentUser("id") userId: string,
    @Res() res: Response,
  ) {
    const { statusCode, ...response } = await this.sessionService.revokeSession(
      userId,
      id,
    );
    res.status(statusCode).json(response);
  }

  @Delete("all/others")
  async revokeAllOthers(
    @CurrentUser("id") userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const sessionId =
      (req as unknown as { session: { id: string } }).session.id || "";
    const { statusCode, ...response } =
      await this.sessionService.revokeAllExcept(userId, sessionId);
    res.status(statusCode).json(response);
  }
}
