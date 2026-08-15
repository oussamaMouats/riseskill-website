"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { COURSE_FORMAT_LABELS_FR, type Course, type EnrollmentRequest } from "@riseskill/shared";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS_FR: Record<EnrollmentRequest["status"], string> = {
  PENDING: "En attente",
  FORWARDED_TO_ERP: "Transmise à l'ERP",
  ACTIVE: "Active",
  REJECTED: "Rejetée",
};

const STATUS_VARIANTS: Record<
  EnrollmentRequest["status"],
  "muted" | "success" | "secondary" | "destructive"
> = {
  PENDING: "muted",
  FORWARDED_TO_ERP: "secondary",
  ACTIVE: "success",
  REJECTED: "destructive",
};

export function getEnrollmentRequestColumns(
  coursesById: Map<string, Course>,
): ColumnDef<EnrollmentRequest>[] {
  return [
    {
      accessorKey: "name",
      header: "Contact",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-foreground">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      id: "course",
      header: "Formation",
      accessorFn: (row) => coursesById.get(row.courseId)?.title ?? "—",
    },
    {
      accessorKey: "format",
      header: "Format",
      cell: ({ row }) => (
        <Badge variant="secondary">{COURSE_FORMAT_LABELS_FR[row.original.format]}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANTS[row.original.status]}>
          {STATUS_LABELS_FR[row.original.status]}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Reçue le",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("fr-FR"),
    },
  ];
}
