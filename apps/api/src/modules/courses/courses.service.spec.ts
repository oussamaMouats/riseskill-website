import { Test } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import type { Course } from "@prisma/client";
import { CoursesRepository } from "./courses.repository";
import { CoursesService } from "./courses.service";

const makeCourse = (overrides: Partial<Course> = {}): Course => ({
  id: "11111111-1111-1111-1111-111111111111",
  slug: "course-demo",
  title: "Formation démo",
  tagline: null,
  description: "Description",
  categoryId: null,
  level: null,
  techStack: [],
  objectives: [],
  coverImageUrl: null,
  published: false,
  promoHeadline: null,
  promoSubheadline: null,
  heroVideoUrl: null,
  enrolledCount: null,
  trustBadges: [],
  guaranteeText: null,
  urgencyText: null,
  instructorName: null,
  instructorTitle: null,
  instructorPhotoUrl: null,
  instructorBio: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("CoursesService", () => {
  let service: CoursesService;
  let repository: jest.Mocked<CoursesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: CoursesRepository,
          useValue: {
            findMany: jest.fn(),
            count: jest.fn(),
            findById: jest.fn(),
            findBySlug: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(CoursesService);
    repository = module.get(CoursesRepository);
  });

  describe("findOne", () => {
    it("throws NotFoundException when the repository resolves null", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne("missing-id")).rejects.toThrow(NotFoundException);
    });

    it("returns the course when found", async () => {
      const course = makeCourse();
      repository.findById.mockResolvedValue(course);

      await expect(service.findOne(course.id)).resolves.toEqual(course);
    });
  });

  describe("create", () => {
    it("throws ConflictException when the slug is already taken", async () => {
      repository.findBySlug.mockResolvedValue(makeCourse());

      await expect(
        service.create({
          slug: "course-demo",
          title: "Titre",
          description: "Description",
        }),
      ).rejects.toThrow(ConflictException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it("creates the course when the slug is free", async () => {
      repository.findBySlug.mockResolvedValue(null);
      const input = {
        slug: "nouvelle-formation",
        title: "Titre",
        description: "Description",
      };
      const created = makeCourse(input);
      repository.create.mockResolvedValue(created);

      const result = await service.create(input);

      expect(repository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(created);
    });
  });
});
