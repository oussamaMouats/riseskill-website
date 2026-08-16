import type { ConfigService } from "@nestjs/config";
import { ServiceUnavailableException } from "@nestjs/common";
import { R2StorageService } from "./r2-storage.service";

const sendMock = jest.fn();
jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: sendMock })),
  PutObjectCommand: jest.fn().mockImplementation((input: unknown) => ({ input })),
}));

function makeConfigService(values: Record<string, string | undefined>) {
  return { get: (key: string) => values[key] } as unknown as ConfigService;
}

describe("R2StorageService", () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it("throws ServiceUnavailableException when R2 is not configured", async () => {
    const service = new R2StorageService(makeConfigService({}));

    await expect(
      service.uploadFile(Buffer.from("x"), "uploads/a.png", "image/png"),
    ).rejects.toThrow(ServiceUnavailableException);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("uploads to R2 and returns the public URL when configured", async () => {
    sendMock.mockResolvedValue({});
    const service = new R2StorageService(
      makeConfigService({
        R2_ACCOUNT_ID: "acc123",
        R2_ACCESS_KEY_ID: "key",
        R2_SECRET_ACCESS_KEY: "secret",
        R2_BUCKET_NAME: "riseskill-media",
        R2_PUBLIC_URL: "https://media.riseskill.dz/",
      }),
    );

    const url = await service.uploadFile(Buffer.from("x"), "uploads/a.png", "image/png");

    expect(url).toBe("https://media.riseskill.dz/uploads/a.png");
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
