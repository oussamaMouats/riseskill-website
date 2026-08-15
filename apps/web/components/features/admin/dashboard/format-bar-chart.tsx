"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COURSE_FORMAT_LABELS_FR, type CourseWithOfferings } from "@riseskill/shared";

export function FormatBarChart({ courses }: { courses: CourseWithOfferings[] }) {
  const counts = courses.reduce<Record<string, number>>((acc, course) => {
    course.offerings.forEach((offering) => {
      acc[offering.format] = (acc[offering.format] ?? 0) + 1;
    });
    return acc;
  }, {});

  const data = Object.entries(COURSE_FORMAT_LABELS_FR).map(([format, label]) => ({
    label,
    value: counts[format] ?? 0,
  }));

  if (courses.length === 0) {
    return (
      <p className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        Aucune formation pour le moment.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={224}>
      <BarChart data={data} margin={{ left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip cursor={{ fill: "hsl(var(--muted))" }} />
        <Bar dataKey="value" fill="#16A34A" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
