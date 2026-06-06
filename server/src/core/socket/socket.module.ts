import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { SocketService } from "./socket.service";

@Module({
  providers: [SocketService, SocketGateway],
  exports: [SocketService], // SocketService is what other modules inject
})
export class SocketModule {}
