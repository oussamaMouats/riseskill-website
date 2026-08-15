"use client";

import { useMemo } from "react";
import { BookOpen, CheckCircle2, Clock, FileEdit } from "lucide-react";
import { PageHeader } from "@/components/features/admin/page-header";
import { StatusPieChart } from "@/components/features/admin/dashboard/status-pie-chart";
import { FormatBarChart } from "@/components/features/admin/dashboard/format-bar-chart";
import { RecentRequests } from "@/components/features/admin/dashboard/recent-requests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCourses } from "@/hooks/use-courses";
import { useAdminEnrollmentRequests } from "@/hooks/use-enrollment-requests";

export default function AdminDashboardPage() {
  const { data: coursesPage, isLoading: coursesLoading } = useAdminCourses();
  const { data: requestsPage, isLoading: requestsLoading } = useAdminEnrollmentRequests();

  const coursesById = useMemo(
    () => new Map((coursesPage?.items ?? []).map((c) => [c.id, c])),
    [coursesPage],
  );
  const isLoading = coursesLoading || requestsLoading;

  const stats = [
    { label: "Formations", value: coursesPage?.total ?? 0, icon: BookOpen },
    {
      label: "Publiées",
      value: coursesPage?.items.filter((c) => c.published).length ?? 0,
      icon: CheckCircle2,
    },
    {
      label: "Brouillons",
      value: coursesPage?.items.filter((c) => !c.published).length ?? 0,
      icon: FileEdit,
    },
    {
      label: "Demandes en attente",
      value: requestsPage?.items.filter((r) => r.status === "PENDING").length ?? 0,
      icon: Clock,
    },
  ];

  return (
    <div>
      <PageHeader title="Tableau de bord" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Demandes par statut</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <StatusPieChart requests={requestsPage?.items ?? []} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Formations par format</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <FormatBarChart courses={coursesPage?.items ?? []} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-base">Dernières demandes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <RecentRequests requests={requestsPage?.items ?? []} coursesById={coursesById} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
