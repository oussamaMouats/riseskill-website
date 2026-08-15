"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { EnrollmentRequest } from "@riseskill/shared";

const STATUS_LABELS_FR: Record<EnrollmentRequest["status"], string> = {
  PENDING: "En attente",
  FORWARDED_TO_ERP: "Transmise à l'ERP",
  ACTIVE: "Active",
  REJECTED: "Rejetée",
};

const STATUS_COLORS: Record<EnrollmentRequest["status"], string> = {
  PENDING: "#94a3b8",
  FORWARDED_TO_ERP: "#132043",
  ACTIVE: "#16A34A",
  REJECTED: "#dc2626",
};

export function StatusPieChart({ requests }: { requests: EnrollmentRequest[] }) {
  const counts = requests.reduce<Record<string, number>>((acc, request) => {
    acc[request.status] = (acc[request.status] ?? 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts).map(([status, count]) => ({
    status,
    label: STATUS_LABELS_FR[status as EnrollmentRequest["status"]],
    value: count,
  }));

  if (data.length === 0) {
    return (
      <p className="flex h-56 items-center justify-center text-sm text-muted-foreground">
        Aucune demande pour le moment.
      </p>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell
                key={entry.status}
                fill={STATUS_COLORS[entry.status as EnrollmentRequest["status"]]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {data.map((entry) => (
          <span key={entry.status} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: STATUS_COLORS[entry.status as EnrollmentRequest["status"]],
              }}
            />
            {entry.label} ({entry.value})
          </span>
        ))}
      </div>
    </div>
  );
}
