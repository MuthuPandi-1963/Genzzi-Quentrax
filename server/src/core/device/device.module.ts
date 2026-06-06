import { Module } from "@nestjs/common";
import { DeviceService } from "./device.service";
import { DeviceController } from "./device.controller";
import { DatabaseModule } from "../../database/database.module";

@Module({
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
  imports: [DatabaseModule],
})
export class DeviceModule {}
