-- AlterTable
ALTER TABLE "courses" DROP COLUMN "currency",
DROP COLUMN "durationLabel",
DROP COLUMN "formats",
DROP COLUMN "price";

-- CreateTable
CREATE TABLE "course_offerings" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "format" "CourseFormat" NOT NULL,
    "price" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'DZD',
    "durationLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_offerings_courseId_format_key" ON "course_offerings"("courseId", "format");

-- AddForeignKey
ALTER TABLE "course_offerings" ADD CONSTRAINT "course_offerings_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

