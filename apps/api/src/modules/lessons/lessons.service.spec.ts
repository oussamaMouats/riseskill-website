import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import type { CourseModule } from "@prisma/client";
import { CourseModulesRepository } from "../course-modules/course-modules.repository";
import { LessonsRepository } from "./lessons.repository";
import { LessonsService } from "./lessons.service";

const makeModule = (overrides: Partial<CourseModule> = {}): CourseModule => ({
  id: "77777777-7777-7777-7777-777777777777",
  courseId: "88888888-8888-8888-8888-888888888888",
  title: "Module 1",
  description: null,
  orderIndex: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("LessonsService", () => {
  let service: LessonsService;
  let lessonsRepository: jest.Mocked<LessonsRepository>;
  let courseModulesRepository: jest.Mocked<CourseModulesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: LessonsRepository,
          useValue: {
            findByModuleId: jest.fn(),
            findById: jest.fn(),
            nextOrderIndex: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        { provide: CourseModulesRepository, useValue: { findById: jest.fn() } },
      ],
    }).compile();

    service = module.get(LessonsService);
    lessonsRepository = module.get(LessonsRepository);
    courseModulesRepository = module.get(CourseModulesRepository);
  });

  describe("create", () => {
    it("throws NotFoundException when the module does not exist", async () => {
      courseModulesRepository.findById.mockResolvedValue(null);

      await expect(service.create({ moduleId: "missing", title: "Leçon 1" })).rejects.toThrow(
        NotFoundException,
      );
      expect(lessonsRepository.create).not.toHaveBeenCalled();
    });

    it("creates the lesson when the module exists", async () => {
      const courseModule = makeModule();
      courseModulesRepository.findById.mockResolvedValue(courseModule);
      lessonsRepository.nextOrderIndex.mockResolvedValue(1);
      lessonsRepository.create.mockResolvedValue({
        id: "99999999-9999-9999-9999-999999999999",
        moduleId: courseModule.id,
        title: "Leçon 1",
        content: null,
        videoUrl: null,
        orderIndex: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create({ moduleId: courseModule.id, title: "Leçon 1" });

      expect(lessonsRepository.create).toHaveBeenCalledWith({
        moduleId: courseModule.id,
        title: "Leçon 1",
        orderIndex: 1,
      });
      expect(result.title).toBe("Leçon 1");
    });
  });
});
