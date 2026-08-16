import { Test } from "@nestjs/testing";
import { R2StorageService } from "./r2-storage.service";
import { UploadsService } from "./uploads.service";

describe("UploadsService", () => {
  let service: UploadsService;
  let r2: jest.Mocked<R2StorageService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UploadsService,
        { provide: R2StorageService, useValue: { uploadFile: jest.fn() } },
      ],
    }).compile();

    service = module.get(UploadsService);
    r2 = module.get(R2StorageService);
  });

  it("uploads the file buffer under a generated key with the correct extension", async () => {
    r2.uploadFile.mockResolvedValue("https://cdn.example.com/uploads/generated.png");
    const file = {
      buffer: Buffer.from("fake-image-bytes"),
      mimetype: "image/png",
    } as Express.Multer.File;

    const url = await service.uploadImage(file);

    expect(r2.uploadFile).toHaveBeenCalledTimes(1);
    const [buffer, key, contentType] = r2.uploadFile.mock.calls[0];
    expect(buffer).toBe(file.buffer);
    expect(key).toMatch(/^uploads\/[0-9a-f-]+\.png$/);
    expect(contentType).toBe("image/png");
    expect(url).toBe("https://cdn.example.com/uploads/generated.png");
  });

  it("defaults to a .jpg extension for jpeg uploads", async () => {
    r2.uploadFile.mockResolvedValue("https://cdn.example.com/uploads/generated.jpg");
    const file = { buffer: Buffer.from("x"), mimetype: "image/jpeg" } as Express.Multer.File;

    await service.uploadImage(file);

    const [, key] = r2.uploadFile.mock.calls[0];
    expect(key).toMatch(/\.jpg$/);
  });
});
