import { Module } from "@nestjs/common";
import { UploadsController } from "./uploads.controller";
import { UploadsService } from "./uploads.service";
import { R2StorageService } from "./r2-storage.service";

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, R2StorageService],
})
export class UploadsModule {}
