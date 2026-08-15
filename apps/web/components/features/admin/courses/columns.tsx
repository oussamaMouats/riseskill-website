"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { COURSE_FORMAT_LABELS_FR, type CourseWithOfferings } from "@riseskill/shared";
import { Badge } from "@/components/ui/badge";
import { CourseRowActions } from "./course-row-actions";

export const courseColumns: ColumnDef<CourseWithOfferings>[] = [
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => (
      <Link
        href={`/admin/courses/${row.original.id}/edit`}
        className="font-medium text-foreground hover:text-primary hover:underline"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "published",
    header: "Statut",
    cell: ({ row }) => (
      <Badge variant={row.original.published ? "success" : "muted"}>
        {row.original.published ? "Publiée" : "Brouillon"}
      </Badge>
    ),
  },
  {
    accessorKey: "offerings",
    header: "Formats",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.offerings.map((offering) => (
          <Badge key={offering.id} variant="secondary" className="font-normal">
            {COURSE_FORMAT_LABELS_FR[offering.format]}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex justify-end">
        <CourseRowActions course={row.original} />
      </div>
    ),
  },
];
