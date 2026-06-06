import { Injectable, Logger } from "@nestjs/common";
import { Server } from "socket.io";

// ─────────────────────────────────────────────────────────────────────────────
// SOCKET SERVICE
//
// Owns the Socket.IO Server reference. The gateway calls registerServer()
// in its afterInit() hook — after that, any provider in the app can inject
// SocketService and emit events without knowing about the gateway at all.
//
// This breaks the circular dependency that occurs when SocketService injects
// SocketGateway while SocketGateway also injects SocketService.
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  private io: Server | null = null;

  // Called by SocketGateway.afterInit() — do NOT inject the gateway here.
  registerServer(server: Server): void {
    this.io = server;
    this.logger.log("Socket.IO server registered.");
  }

  // ── Broadcast to all connected clients ───────────────────────────────────

  emit(event: string, payload: unknown): void {
    if (!this.io) {
      this.logger.warn(`emit("${event}") skipped — server not ready.`);
      return;
    }
    this.io.emit(event, payload);
  }

  // ── Emit to a specific room (e.g. "user:<id>", "mailbox:<id>") ───────────

  emitToRoom(room: string, event: string, payload: unknown): void {
    if (!this.io) {
      this.logger.warn(
        `emitToRoom("${room}", "${event}") skipped — server not ready.`,
      );
      return;
    }
    this.io.to(room).emit(event, payload);
  }

  // ── Join a client socket to a user-specific room ─────────────────────────

  async joinUserRoom(clientId: string, userId: string): Promise<void> {
    if (!this.io) {
      this.logger.warn(`joinUserRoom skipped — server not ready.`);
      return;
    }
    const socket = this.io.sockets.sockets.get(clientId);
    await socket?.join(`user:${userId}`);
  }
}
