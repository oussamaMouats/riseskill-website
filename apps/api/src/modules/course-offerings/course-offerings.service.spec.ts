import { Test } from "@nestjs/testing";
import { ConflictException, NotFoundException } from "@nestjs/common";
import type { Course } from "@prisma/client";
import { CoursesRepository } from "../courses/courses.repository";
import { CourseOfferingsRepository } from "./course-offerings.repository";
import { CourseOfferingsService } from "./course-offerings.service";

const makeCourse = (overrides: Partial<Course> = {}): Course => ({
  id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
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

describe("CourseOfferingsService", () => {
  let service: CourseOfferingsService;
  let offeringsRepository: jest.Mocked<CourseOfferingsRepository>;
  let coursesRepository: jest.Mocked<CoursesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CourseOfferingsService,
        {
          provide: CourseOfferingsRepository,
          useValue: {
            findByCourseId: jest.fn(),
            findById: jest.fn(),
            findByCourseAndFormat: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        { provide: CoursesRepository, useValue: { findById: jest.fn() } },
      ],
    }).compile();

    service = module.get(CourseOfferingsService);
    offeringsRepository = module.get(CourseOfferingsRepository);
    coursesRepository = module.get(CoursesRepository);
  });

  describe("create", () => {
    it("throws NotFoundException when the course does not exist", async () => {
      coursesRepository.findById.mockResolvedValue(null);

      await expect(service.create({ courseId: "missing", format: "IN_PERSON" })).rejects.toThrow(
        NotFoundException,
      );
      expect(offeringsRepository.create).not.toHaveBeenCalled();
    });

    it("throws ConflictException when an offering already exists for this format", async () => {
      const course = makeCourse();
      coursesRepository.findById.mockResolvedValue(course);
      offeringsRepository.findByCourseAndFormat.mockResolvedValue({
        id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
        courseId: course.id,
        format: "IN_PERSON",
        price: 5000,
        currency: "DZD",
        durationLabel: "23h",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(service.create({ courseId: course.id, format: "IN_PERSON" })).rejects.toThrow(
        ConflictException,
      );
      expect(offeringsRepository.create).not.toHaveBeenCalled();
    });

    it("creates the offering when the course exists and the format is free", async () => {
      const course = makeCourse();
      coursesRepository.findById.mockResolvedValue(course);
      offeringsRepository.findByCourseAndFormat.mockResolvedValue(null);
      const input = {
        courseId: course.id,
        format: "ONLINE_LIVE" as const,
        price: 15000,
        durationLabel: "5h",
      };
      offeringsRepository.create.mockResolvedValue({
        id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
        currency: "DZD",
        ...input,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.create(input);

      expect(offeringsRepository.create).toHaveBeenCalledWith(input);
      expect(result.format).toBe("ONLINE_LIVE");
    });
  });
});
