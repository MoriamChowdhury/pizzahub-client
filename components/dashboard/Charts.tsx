"use client";

import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS: Record<string, string> = {
  pending: "#f59e0b",
  accepted: "#16a34a",
  approved: "#16a34a",
  rejected: "#dc2626",
  cancelled: "#6b7280",
  inactive: "#6b7280",
  vendor: "#ea580c",
  customer: "#2563eb",
  admin: "#7c3aed",
};
const FALLBACK = "#a3a3a3";

function toData(record: Record<string, number>) {
  return Object.entries(record).map(([name, value]) => ({ name, value }));
}

function Empty() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
      No data to show yet
    </div>
  );
}

export function StatusPieChart({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const rows = toData(data);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={rows} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {rows.map((r) => (
                  <Cell key={r.name} fill={COLORS[r.name] || FALLBACK} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function StatusBarChart({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const rows = toData(data);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <Empty />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {rows.map((r) => (
                  <Cell key={r.name} fill={COLORS[r.name] || FALLBACK} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}