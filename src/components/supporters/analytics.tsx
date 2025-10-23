"use client";

import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";
import { Loader2, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSupporters } from "@/hooks/api/useSupporters";

const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#7C3AED"];

export default function SupporterAnalytics() {
  const { data, isLoading, isError } = useSupporters();
 const supporters = data?.supporters;
  // Handle loading/error states
  if (isLoading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        <AlertTriangle className="mr-2" /> Error loading supporters
      </div>
    );

  // ---- COMPUTED ANALYTICS ----
  const total = supporters?.length ?? 0;

  const genderStats = useMemo(() => {
    const counts: Record<string, number> = {};
    supporters?.forEach((s) => {
      counts[s.gender] = (counts[s.gender] || 0) + 1;
    });
    return Object.entries(counts).map(([gender, count]) => ({ gender, count }));
  }, [supporters]);

  const statusStats = useMemo(() => {
    const counts: Record<string, number> = {};
    supporters?.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [supporters]);

  const regionStats = useMemo(() => {
    const counts: Record<string, number> = {};
    supporters?.forEach((s) => {
      const name = s.region?.name || "Unknown";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([region, count]) => ({ region, count }));
  }, [supporters]);
  const ageStats = useMemo(() => {
    const now = new Date();
    const counts = { "18-25": 0, "26-35": 0, "36-50": 0, "51+": 0, Unknown: 0 };
    supporters?.forEach((s) => {
      if (!s.birthdate) return (counts.Unknown += 1);
      const age = now.getFullYear() - new Date(s.birthdate).getFullYear();
      if (age <= 25) counts["18-25"]++;
      else if (age <= 35) counts["26-35"]++;
      else if (age <= 50) counts["36-50"]++;
      else counts["51+"]++;
    });
    return Object.entries(counts).map(([range, count]) => ({ range, count }));
  }, [supporters]);

  // ---- UI RENDER ----
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Overview */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Supporters</p>
            <p className="text-3xl font-bold">{total}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Regions</p>
            <p className="text-3xl font-bold">{regionStats.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Statuses</p>
            <p className="text-3xl font-bold">{statusStats.length}</p>
          </div>
        </CardContent>
      </Card>

      {/* Gender Distribution */}
      <Card>
        <CardHeader><CardTitle>Gender Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={genderStats} dataKey="count" nameKey="gender" label>
                {genderStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card>
        <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusStats}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#2563EB" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Region Breakdown */}
      <Card className="col-span-2">
        <CardHeader><CardTitle>Supporters by Region</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionStats}>
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#16A34A" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Age Distribution */}
      <Card>
        <CardHeader><CardTitle>Age Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ageStats}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
