"use client";

import { type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useEnrollmentRequest } from "@/hooks/use-enrollment-request";
import {
  COURSE_FORMAT_LABELS_FR,
  type Course,
  type CourseFormat,
  type CourseOffering,
} from "@riseskill/shared";

const allFormatEntries = Object.entries(COURSE_FORMAT_LABELS_FR) as [CourseFormat, string][];

interface EnrollmentFormProps {
  /** Full course list + dropdown, used on /contact when no course is pre-selected. */
  courses?: Course[];
  preselectedSlug?: string;
  /** When set, the course dropdown is hidden and this course is used directly (embedded landing-page form). */
  course?: Course;
  /** Restricts the format choices to this course's own offerings. */
  offerings?: CourseOffering[];
  /** Tighter spacing for embedding inline on a landing page. */
  compact?: boolean;
}

export function EnrollmentForm({
  courses,
  preselectedSlug,
  course,
  offerings,
  compact,
}: EnrollmentFormProps) {
  const { status, error, submit } = useEnrollmentRequest();
  const formatEntries = offerings
    ? offerings.map((o) => [o.format, COURSE_FORMAT_LABELS_FR[o.format]] as const)
    : allFormatEntries;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    let courseId = course?.id;
    if (!courseId) {
      const courseSlug = formData.get("course") as string;
      courseId = courses?.find((c) => c.slug === courseSlug)?.id;
    }
    if (!courseId) return;

    const succeeded = await submit({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      courseId,
      format: formData.get("format") as CourseFormat,
      message: (formData.get("message") as string) || undefined,
    });
    if (succeeded) {
      event.currentTarget.reset();
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl2 border border-brand-green-200 bg-brand-green-50 p-6 text-brand-green-800">
        <p className="font-semibold">Demande envoyée !</p>
        <p className="mt-1 text-sm">
          Notre équipe vous recontacte rapidement pour finaliser votre inscription.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      <input
        name="name"
        required
        className="w-full rounded-md border border-slate-300 px-3 py-2"
        placeholder="Nom complet"
      />
      <input
        name="email"
        required
        type="email"
        className="w-full rounded-md border border-slate-300 px-3 py-2"
        placeholder="Email"
      />
      <input
        name="phone"
        type="tel"
        className="w-full rounded-md border border-slate-300 px-3 py-2"
        placeholder="Téléphone"
      />
      {!course && (
        <select
          name="course"
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-700"
          defaultValue={preselectedSlug ?? ""}
        >
          <option value="" disabled>
            Choisir une formation
          </option>
          {courses?.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      )}
      <select
        name="format"
        required
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-700"
        defaultValue=""
      >
        <option value="" disabled>
          Choisir un format
        </option>
        {formatEntries.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {!compact && (
        <textarea
          name="message"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          placeholder="Message (optionnel)"
          rows={4}
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full" disabled={status === "submitting"}>
        {status === "submitting" ? "Envoi..." : "Envoyer la demande"}
      </Button>
    </form>
  );
}
