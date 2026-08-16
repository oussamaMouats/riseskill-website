import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import { R2StorageService } from "./r2-storage.service";

const EXTENSION_BY_MIME_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

@Injectable()
export class UploadsService {
  constructor(private readonly r2: R2StorageService) {}

  uploadImage(file: Express.Multer.File): Promise<string> {
    const extension = EXTENSION_BY_MIME_TYPE[file.mimetype] ?? "jpg";
    const key = `uploads/${randomUUID()}.${extension}`;
    return this.r2.uploadFile(file.buffer, key, file.mimetype);
  }
}
