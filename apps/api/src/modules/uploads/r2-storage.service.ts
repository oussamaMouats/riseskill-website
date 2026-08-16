import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

@Injectable()
export class R2StorageService {
  private readonly client: S3Client | null;
  private readonly bucket?: string;
  private readonly publicUrl?: string;

  constructor(private readonly configService: ConfigService) {
    const accountId = this.configService.get<string>("R2_ACCOUNT_ID");
    const accessKeyId = this.configService.get<string>("R2_ACCESS_KEY_ID");
    const secretAccessKey = this.configService.get<string>("R2_SECRET_ACCESS_KEY");
    this.bucket = this.configService.get<string>("R2_BUCKET_NAME");
    this.publicUrl = this.configService.get<string>("R2_PUBLIC_URL");

    this.client =
      accountId && accessKeyId && secretAccessKey
        ? new S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: { accessKeyId, secretAccessKey },
          })
        : null;
  }

  async uploadFile(body: Buffer, key: string, contentType: string): Promise<string> {
    if (!this.client || !this.bucket || !this.publicUrl) {
      throw new ServiceUnavailableException(
        "Le stockage d'images (R2) n'est pas configuré. Renseignez R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME et R2_PUBLIC_URL.",
      );
    }
    await this.client.send(
      new PutObjectCommand({ Bucket: this.bucket, Key: key, Body: body, ContentType: contentType }),
    );
    return `${this.publicUrl.replace(/\/$/, "")}/${key}`;
  }
}
