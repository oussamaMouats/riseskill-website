import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import type { Course } from "@prisma/client";
import { CoursesRepository } from "../courses/courses.repository";
import { CourseTestimonialsRepository } from "./course-testimonials.repository";
import { CourseTestimonialsService } from "./course-testimonials.service";

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

describe("CourseTestimonialsService", () => {
  let service: CourseTestimonialsService;
  let courseTestimonialsRepository: jest.Mocked<CourseTestimonialsRepository>;
  let coursesRepository: jest.Mocked<CoursesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CourseTestimonialsService,
        {
          provide: CourseTestimonialsRepository,
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

    service = module.get(CourseTestimonialsService);
    courseTestimonialsRepository = module.get(CourseTestimonialsRepository);
    coursesRepository = module.get(CoursesRepository);
  });

  describe("create", () => {
    it("throws NotFoundException when the course does not exist", async () => {
      coursesRepository.findById.mockResolvedValue(null);

      await expect(
        service.create({
          courseId: "missing",
          authorName: "Yacine B.",
          quote: "Excellente formation",
        }),
      ).rejects.toThrow(NotFoundException);
      expect(courseTestimonialsRepository.create).not.toHaveBeenCalled();
    });

    it("auto-computes orderIndex when not provided", async () => {
      const course = makeCourse();
      coursesRepository.findById.mockResolvedValue(course);
      courseTestimonialsRepository.nextOrderIndex.mockResolvedValue(3);
      courseTestimonialsRepository.create.mockResolvedValue({
        id: "66666666-6666-6666-6666-666666666666",
        courseId: course.id,
        authorName: "Yacine B.",
        authorRole: null,
        photoUrl: null,
        quote: "Excellente formation",
        rating: null,
        orderIndex: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create({
        courseId: course.id,
        authorName: "Yacine B.",
        quote: "Excellente formation",
      });

      expect(courseTestimonialsRepository.create).toHaveBeenCalledWith({
        courseId: course.id,
        authorName: "Yacine B.",
        quote: "Excellente formation",
        orderIndex: 3,
      });
      expect(result.orderIndex).toBe(3);
    });
  });
});
