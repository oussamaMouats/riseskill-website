import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import type { Course } from "@prisma/client";
import { CoursesRepository } from "../courses/courses.repository";
import { CourseFaqRepository } from "./course-faq.repository";
import { CourseFaqService } from "./course-faq.service";

const makeCourse = (overrides: Partial<Course> = {}): Course => ({
  id: "55555555-5555-5555-5555-555555555555",
  slug: "course-demo",
  title: "Formation démo",
  tagline: null,
  description: "Description",
  categoryId: null,
  level: null,
  techStack: [],
  objectives: [],
  coverImageUrl: null,
  published: true,
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

describe("CourseFaqService", () => {
  let service: CourseFaqService;
  let courseFaqRepository: jest.Mocked<CourseFaqRepository>;
  let coursesRepository: jest.Mocked<CoursesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CourseFaqService,
        {
          provide: CourseFaqRepository,
          useValue: {
            findByCourseId: jest.fn(),
            findById: jest.fn(),
            nextOrderIndex: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        { provide: CoursesRepository, useValue: { findById: jest.fn() } },
      ],
    }).compile();

    service = module.get(CourseFaqService);
    courseFaqRepository = module.get(CourseFaqRepository);
    coursesRepository = module.get(CoursesRepository);
  });

  describe("create", () => {
    it("throws NotFoundException when the course does not exist", async () => {
      coursesRepository.findById.mockResolvedValue(null);

      await expect(
        service.create({
          courseId: "missing",
          question: "Faut-il un ordinateur ?",
          answer: "Oui, portable ou fixe.",
        }),
      ).rejects.toThrow(NotFoundException);
      expect(courseFaqRepository.create).not.toHaveBeenCalled();
    });

    it("auto-computes orderIndex when not provided", async () => {
      const course = makeCourse();
      coursesRepository.findById.mockResolvedValue(course);
      courseFaqRepository.nextOrderIndex.mockResolvedValue(3);
      courseFaqRepository.create.mockResolvedValue({
        id: "66666666-6666-6666-6666-666666666666",
        courseId: course.id,
        question: "Faut-il un ordinateur ?",
        answer: "Oui, portable ou fixe.",
        orderIndex: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create({
        courseId: course.id,
        question: "Faut-il un ordinateur ?",
        answer: "Oui, portable ou fixe.",
      });

      expect(courseFaqRepository.create).toHaveBeenCalledWith({
        courseId: course.id,
        question: "Faut-il un ordinateur ?",
        answer: "Oui, portable ou fixe.",
        orderIndex: 3,
      });
      expect(result.orderIndex).toBe(3);
    });
  });
});
