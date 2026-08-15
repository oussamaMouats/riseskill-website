"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/features/admin/page-header";
import { DataTable } from "@/components/features/admin/data-table";
import { getEnrollmentRequestColumns } from "@/components/features/admin/enrollment-requests/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCourses } from "@/hooks/use-courses";
import { useAdminEnrollmentRequests } from "@/hooks/use-enrollment-requests";

export default function AdminEnrollmentRequestsPage() {
  const { data: requestsPage, isLoading: requestsLoading, isError } = useAdminEnrollmentRequests();
  const { data: coursesPage, isLoading: coursesLoading } = useAdminCourses();

  const coursesById = useMemo(
    () => new Map((coursesPage?.items ?? []).map((course) => [course.id, course])),
    [coursesPage],
  );
  const columns = useMemo(() => getEnrollmentRequestColumns(coursesById), [coursesById]);
  const isLoading = requestsLoading || coursesLoading;

  return (
    <div>
      <PageHeader
        title="Demandes d'inscription"
        description="Présentiel/en ligne live → à transmettre à l'ERP ; en ligne autonome → à activer. Ces actions arrivent avec les prochaines phases."
      />

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}
      {isError && <p className="text-sm text-destructive">Impossible de charger les demandes.</p>}
      {requestsPage && !isLoading && (
        <DataTable
          columns={columns}
          data={requestsPage.items}
          searchPlaceholder="Rechercher une demande..."
          emptyMessage="Aucune demande pour le moment."
        />
      )}
    </div>
  );
}
