import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { validateEnv } from "./config/env.validation";
import { supabaseConfig } from "./config/supabase.config";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { CoursesModule } from "./modules/courses/courses.module";
import { CourseOfferingsModule } from "./modules/course-offerings/course-offerings.module";
import { CourseModulesModule } from "./modules/course-modules/course-modules.module";
import { CourseTestimonialsModule } from "./modules/course-testimonials/course-testimonials.module";
import { CourseFaqModule } from "./modules/course-faq/course-faq.module";
import { LessonsModule } from "./modules/lessons/lessons.module";
import { EnrollmentRequestsModule } from "./modules/enrollment-requests/enrollment-requests.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      load: [supabaseConfig],
    }),
    PrismaModule,
    HealthModule,
    AuthModule,
    CategoriesModule,
    CoursesModule,
    CourseOfferingsModule,
    CourseModulesModule,
    CourseTestimonialsModule,
    CourseFaqModule,
    LessonsModule,
    EnrollmentRequestsModule,
  ],
})
export class AppModule {}
