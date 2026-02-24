"use client";

import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";

type DataItem = {
  label: string;
  value: number;
};

type PeriodData = {
  users: number;
  pageviews: number;
  countries: DataItem[];
  sources: DataItem[];
  trend: Array<{ label: string; value: number }>;
  daily: Array<{ label: string; users: number; pageviews: number }>;
  topPages: Array<{ path: string; views: number; bounceRate: number; avgDurationSec: number }>;
};

type PeriodKey = "7d" | "30d" | "90d";

const periodOptions: Array<{ key: PeriodKey; label: string }> = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
];

const palette = ["#7c3aed", "#a855f7", "#c084fc", "#8b5cf6", "#d946ef", "#6d28d9"];

function buildConicGradient(items: DataItem[]) {
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  let start = 0;

  const stops = items.map((item, index) => {
    const percent = (item.value / total) * 100;
    const end = start + percent;
    const color = palette[index % palette.length];
    const stop = `${color} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    start = end;
    return stop;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

export function SiteAnalyticsCharts({
  periodData,
}: {
  periodData: Record<PeriodKey, PeriodData>;
}) {
  const [periodKey, setPeriodKey] = useState<PeriodKey>("30d");
  const data = periodData[periodKey];

  const totalCountry = data.countries.reduce((sum, item) => sum + item.value, 0) || 1;
  const totalSource = data.sources.reduce((sum, item) => sum + item.value, 0) || 1;

  const chart = useMemo(() => {
    const points = data.trend;
    const max = Math.max(...points.map((item) => item.value), 1);
    const width = Math.max(800, points.length * 30);
    const height = 220;
    const xStep = width / Math.max(points.length - 1, 1);

    const linePoints = points
      .map((point, index) => {
        const x = index * xStep;
        const y = height - (point.value / max) * (height - 30) - 10;
        return `${x},${y}`;
      })
      .join(" ");

    return { width, height, linePoints };
  }, [data.trend]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Traffic analytics</h3>
          <div className="flex gap-2 rounded-lg bg-zinc-100 p-1">
            {periodOptions.map((item) => (
              <button
                key={item.key}
                className={`rounded-md px-3 py-1 text-sm ${
                  periodKey === item.key ? "bg-violet-600 text-white" : "text-zinc-700 hover:bg-zinc-200"
                }`}
                onClick={() => setPeriodKey(item.key)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-zinc-50 p-3">
            <p className="text-xs text-zinc-500">Users ({periodKey})</p>
            <p className="text-2xl font-semibold">{data.users.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-zinc-50 p-3">
            <p className="text-xs text-zinc-500">Pageviews ({periodKey})</p>
            <p className="text-2xl font-semibold">{data.pageviews.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h4 className="text-base font-semibold">Visitors by country</h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
            <div className="mx-auto">
              <div className="grid size-40 place-items-center rounded-full" style={{ background: buildConicGradient(data.countries) }}>
                <div className="grid size-24 place-items-center rounded-full bg-white text-center">
                  <p className="text-xs text-zinc-500">Total</p>
                  <p className="text-sm font-semibold">{totalCountry.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {data.countries.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                    {item.label}
                  </span>
                  <span className="font-medium text-zinc-800">{Math.round((item.value / totalCountry) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <h4 className="text-base font-semibold">Traffic sources</h4>
          <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
            <div className="mx-auto">
              <div className="grid size-40 place-items-center rounded-full" style={{ background: buildConicGradient(data.sources) }}>
                <div className="grid size-24 place-items-center rounded-full bg-white text-center">
                  <p className="text-xs text-zinc-500">Total</p>
                  <p className="text-sm font-semibold">{totalSource.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {data.sources.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                    {item.label}
                  </span>
                  <span className="font-medium text-zinc-800">{Math.round((item.value / totalSource) * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h4 className="text-base font-semibold">Daily curve (scroll horizontally)</h4>
        <div className="mt-4 overflow-x-auto">
          <svg height={chart.height} width={chart.width}>
            <polyline fill="none" points={chart.linePoints} stroke="#7c3aed" strokeWidth="3" />
          </svg>
          <div className="mt-2 flex" style={{ width: `${chart.width}px` }}>
            {data.trend.map((item) => (
              <span key={item.label} className="flex-1 text-center text-[11px] text-zinc-500">
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <h4 className="text-base font-semibold">Stats by day</h4>
        <div className="mt-4 max-h-72 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-2 py-2">Day</th>
                <th className="px-2 py-2">Users</th>
                <th className="px-2 py-2">Pageviews</th>
              </tr>
            </thead>
            <tbody>
              {data.daily.map((item) => (
                <tr key={item.label} className="border-b border-zinc-100">
                  <td className="px-2 py-2">{item.label}</td>
                  <td className="px-2 py-2">{item.users.toLocaleString()}</td>
                  <td className="px-2 py-2">{item.pageviews.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h4 className="text-base font-semibold">Most visited pages</h4>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-2 py-2">Page</th>
                <th className="px-2 py-2">Views</th>
                <th className="px-2 py-2">Bounce rate</th>
                <th className="px-2 py-2">Avg duration</th>
              </tr>
            </thead>
            <tbody>
              {data.topPages.map((item) => (
                <tr key={item.path} className="border-b border-zinc-100">
                  <td className="px-2 py-2 font-medium">{item.path}</td>
                  <td className="px-2 py-2">{item.views.toLocaleString()}</td>
                  <td className="px-2 py-2">{item.bounceRate}%</td>
                  <td className="px-2 py-2">{item.avgDurationSec}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
