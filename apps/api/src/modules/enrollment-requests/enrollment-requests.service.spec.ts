import { Test } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import type { Course } from "@prisma/client";
import { CoursesRepository } from "../courses/courses.repository";
import { EnrollmentRequestsRepository } from "./enrollment-requests.repository";
import { EnrollmentRequestsService } from "./enrollment-requests.service";

const makeCourse = (overrides: Partial<Course> = {}): Course => ({
  id: "33333333-3333-3333-3333-333333333333",
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

describe("EnrollmentRequestsService", () => {
  let service: EnrollmentRequestsService;
  let enrollmentRequestsRepository: jest.Mocked<EnrollmentRequestsRepository>;
  let coursesRepository: jest.Mocked<CoursesRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EnrollmentRequestsService,
        {
          provide: EnrollmentRequestsRepository,
          useValue: {
            findMany: jest.fn(),
            count: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
        { provide: CoursesRepository, useValue: { findById: jest.fn() } },
      ],
    }).compile();

    service = module.get(EnrollmentRequestsService);
    enrollmentRequestsRepository = module.get(EnrollmentRequestsRepository);
    coursesRepository = module.get(CoursesRepository);
  });

  describe("create", () => {
    it("throws NotFoundException when the course does not exist", async () => {
      coursesRepository.findById.mockResolvedValue(null);

      await expect(
        service.create({
          name: "Ali",
          email: "ali@example.com",
          courseId: "missing-course",
          format: "IN_PERSON",
        }),
      ).rejects.toThrow(NotFoundException);
      expect(enrollmentRequestsRepository.create).not.toHaveBeenCalled();
    });

    it("creates the enrollment request when the course exists", async () => {
      const course = makeCourse();
      coursesRepository.findById.mockResolvedValue(course);
      const input = {
        name: "Ali",
        email: "ali@example.com",
        courseId: course.id,
        format: "ONLINE_SELF_PACED" as const,
      };
      enrollmentRequestsRepository.create.mockResolvedValue({
        id: "44444444-4444-4444-4444-444444444444",
        name: input.name,
        email: input.email,
        phone: null,
        courseId: input.courseId,
        format: input.format,
        message: null,
        status: "PENDING",
        createdAt: new Date(),
      });

      const result = await service.create(input);

      expect(enrollmentRequestsRepository.create).toHaveBeenCalledWith(input);
      expect(result.status).toBe("PENDING");
    });
  });
});
