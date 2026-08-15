import Link from "next/link";
import { COURSE_FORMAT_LABELS_FR, type Course, type EnrollmentRequest } from "@riseskill/shared";
import { Badge } from "@/components/ui/badge";

export function RecentRequests({
  requests,
  coursesById,
}: {
  requests: EnrollmentRequest[];
  coursesById: Map<string, Course>;
}) {
  const recent = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (recent.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune demande pour le moment.</p>;
  }

  return (
    <ul className="divide-y">
      {recent.map((request) => (
        <li key={request.id} className="flex items-center justify-between py-3 text-sm">
          <div>
            <p className="font-medium text-foreground">{request.name}</p>
            <p className="text-xs text-muted-foreground">
              {coursesById.get(request.courseId)?.title ?? "—"}
            </p>
          </div>
          <Badge variant="secondary" className="font-normal">
            {COURSE_FORMAT_LABELS_FR[request.format]}
          </Badge>
        </li>
      ))}
      <li className="pt-3 text-right">
        <Link
          href="/admin/enrollment-requests"
          className="text-sm font-medium text-primary hover:underline"
        >
          Voir toutes les demandes →
        </Link>
      </li>
    </ul>
  );
}
