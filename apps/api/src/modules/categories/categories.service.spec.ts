import { Test } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import type { Category } from "@prisma/client";
import { CategoriesRepository } from "./categories.repository";
import { CategoriesService } from "./categories.service";

const makeCategory = (overrides: Partial<Category> = {}): Category => ({
  id: "22222222-2222-2222-2222-222222222222",
  slug: "developpement",
  name: "Développement",
  icon: null,
  description: null,
  createdAt: new Date(),
  ...overrides,
});

describe("CategoriesService", () => {
  let service: CategoriesService;
  let repository: jest.Mocked<CategoriesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: {
            findMany: jest.fn(),
            findById: jest.fn(),
            findBySlug: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CategoriesService);
    repository = module.get(CategoriesRepository);
  });

  describe("findOne", () => {
    it("throws NotFoundException when the repository resolves null", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne("missing-id")).rejects.toThrow(NotFoundException);
    });
  });

  describe("create", () => {
    it("throws ConflictException when the slug is already taken", async () => {
      repository.findBySlug.mockResolvedValue(makeCategory());

      await expect(
        service.create({ slug: "developpement", name: "Développement" }),
      ).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });
});
