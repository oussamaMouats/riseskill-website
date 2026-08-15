-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "enrolledCount" INTEGER,
ADD COLUMN     "guaranteeText" TEXT,
ADD COLUMN     "heroVideoUrl" TEXT,
ADD COLUMN     "instructorBio" TEXT,
ADD COLUMN     "instructorName" TEXT,
ADD COLUMN     "instructorPhotoUrl" TEXT,
ADD COLUMN     "instructorTitle" TEXT,
ADD COLUMN     "promoHeadline" TEXT,
ADD COLUMN     "promoSubheadline" TEXT,
ADD COLUMN     "trustBadges" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "urgencyText" TEXT;

-- CreateTable
CREATE TABLE "course_testimonials" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT,
    "photoUrl" TEXT,
    "quote" TEXT NOT NULL,
    "rating" INTEGER,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_faq_items" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_faq_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "course_testimonials" ADD CONSTRAINT "course_testimonials_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_faq_items" ADD CONSTRAINT "course_faq_items_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

