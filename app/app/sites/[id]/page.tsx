import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format, subDays } from "date-fns";

import { SiteAnalyticsCharts } from "@/components/site-analytics-charts";
import { SiteConfigModal } from "@/components/site-config-modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { hasPermission } from "@/lib/permissions";
import { requireWorkspaceRole } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

type PeriodKey = "7d" | "30d" | "90d";

type PeriodDataset = {
  users: number;
  pageviews: number;
  bounceRate: number;
  avgDurationSec: number;
  countries: Array<{ label: string; value: number }>;
  sources: Array<{ label: string; value: number }>;
  trend: Array<{ label: string; value: number }>;
  daily: Array<{ label: string; users: number; pageviews: number }>;
  topPages: Array<{ path: string; views: number; bounceRate: number; avgDurationSec: number }>;
};

export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const site = await prisma.site.findUnique({
    where: { id },
    include: {
      workspace: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!site) {
    notFound();
  }

  let membership;
  try {
    membership = await requireWorkspaceRole(site.workspaceId, "VIEWER");
  } catch {
    redirect("/app/sites");
  }

  const now = new Date();
  const since90 = subDays(now, 89);
  const events = await prisma.analyticsEvent.findMany({
    where: {
      siteId: site.id,
      eventName: "page_view",
      createdAt: {
        gte: since90,
      },
    },
    select: {
      createdAt: true,
      path: true,
      country: true,
      source: true,
      referrer: true,
      visitorId: true,
      durationMs: true,
      bounced: true,
    },
  });


  const dailyAgg = new Map<
    string,
    {
      pageviews: number;
      visitors: Set<string>;
    }
  >();
  const countryAgg = new Map<string, number>();
  const sourceAgg = new Map<string, number>();
  const referrerAgg = new Map<string, number>();
  const pageAgg = new Map<string, { views: number; bounces: number; durationMs: number }>();

  for (const event of events) {
    const dayKey = format(event.createdAt, "yyyy-MM-dd");
    const daily = dailyAgg.get(dayKey) ?? { pageviews: 0, visitors: new Set<string>() };
    daily.pageviews += 1;
    daily.visitors.add(event.visitorId ?? `anon-${dayKey}`);
    dailyAgg.set(dayKey, daily);

    const country = event.country ?? "Unknown";
    countryAgg.set(country, (countryAgg.get(country) ?? 0) + 1);

    const source = event.source ?? "Direct";
    sourceAgg.set(source, (sourceAgg.get(source) ?? 0) + 1);

    const referrer = event.referrer && event.referrer.trim().length > 0 ? event.referrer : "direct";
    referrerAgg.set(referrer, (referrerAgg.get(referrer) ?? 0) + 1);

    const page = event.path || "/";
    const pageData = pageAgg.get(page) ?? { views: 0, bounces: 0, durationMs: 0 };
    pageData.views += 1;
    pageData.durationMs += event.durationMs ?? 0;
    if (event.bounced) {
      pageData.bounces += 1;
    }
    pageAgg.set(page, pageData);
  }

  const totalPageviews = events.length;
  function buildPeriodData(periodDays: number): PeriodDataset {
    const startDate = subDays(now, periodDays - 1);
    const filtered = events.filter((event: (typeof events)[number]) => event.createdAt >= startDate);
    const totalViews = filtered.length;
    const userSet = new Set(filtered.map((item: (typeof filtered)[number]) => item.visitorId ?? "anon"));

    const periodCountry = new Map<string, number>();
    const periodSource = new Map<string, number>();
    const periodPage = new Map<string, { views: number; bounces: number; durationMs: number }>();
    const periodDaily = new Map<string, { pageviews: number; visitors: Set<string> }>();
    let periodBounceCount = 0;
    let periodDurationMs = 0;

    for (const event of filtered) {
      const dayKey = format(event.createdAt, "yyyy-MM-dd");
      const dayEntry = periodDaily.get(dayKey) ?? { pageviews: 0, visitors: new Set<string>() };
      dayEntry.pageviews += 1;
      dayEntry.visitors.add(event.visitorId ?? `anon-${dayKey}`);
      periodDaily.set(dayKey, dayEntry);

      const country = event.country ?? "Unknown";
      periodCountry.set(country, (periodCountry.get(country) ?? 0) + 1);

      const source = event.source ?? "Direct";
      periodSource.set(source, (periodSource.get(source) ?? 0) + 1);

      const page = event.path || "/";
      const pageEntry = periodPage.get(page) ?? { views: 0, bounces: 0, durationMs: 0 };
      pageEntry.views += 1;
      pageEntry.durationMs += event.durationMs ?? 0;
      if (event.bounced) {
        pageEntry.bounces += 1;
        periodBounceCount += 1;
      }
      periodPage.set(page, pageEntry);
      periodDurationMs += event.durationMs ?? 0;
    }

    const trend = Array.from({ length: periodDays }, (_, index) => {
      const date = subDays(now, periodDays - index - 1);
      const dayKey = format(date, "yyyy-MM-dd");
      const day = periodDaily.get(dayKey);
      return {
        label: format(date, periodDays > 30 ? "dd/MM" : "EEE"),
        value: day?.pageviews ?? 0,
      };
    });

    const daily = Array.from({ length: periodDays }, (_, index) => {
      const date = subDays(now, periodDays - index - 1);
      const dayKey = format(date, "yyyy-MM-dd");
      const day = periodDaily.get(dayKey);
      return {
        label: format(date, "dd/MM"),
        users: day?.visitors.size ?? 0,
        pageviews: day?.pageviews ?? 0,
      };
    });

    const countries = Array.from(periodCountry.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));

    const sources = Array.from(periodSource.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));

    const topPages = Array.from(periodPage.entries())
      .sort((a, b) => b[1].views - a[1].views)
      .slice(0, 8)
      .map(([path, stats]) => ({
        path,
        views: stats.views,
        bounceRate: Math.round((stats.bounces / Math.max(stats.views, 1)) * 100),
        avgDurationSec: Math.round(stats.durationMs / Math.max(stats.views, 1) / 1000),
      }));

    return {
      users: userSet.size,
      pageviews: totalViews,
      bounceRate: Math.round((periodBounceCount / Math.max(totalViews, 1)) * 100),
      avgDurationSec: Math.round(periodDurationMs / Math.max(totalViews, 1) / 1000),
      countries,
      sources,
      trend,
      daily,
      topPages,
    };
  }

  const periodData: Record<PeriodKey, PeriodDataset> = {
    "7d": buildPeriodData(7),
    "30d": buildPeriodData(30),
    "90d": buildPeriodData(90),
  };

  const summary30 = periodData["30d"];
  const topUsers = summary30.users;
  const topPageviews = summary30.pageviews;
  const topBounceRate = summary30.bounceRate;
  const topAvgSession = summary30.avgDurationSec;

  const referrers = Array.from(referrerAgg.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, visits]) => ({ name, visits }));

  const canConfigure = membership
    ? hasPermission(membership.role, "sites.manage") || hasPermission(membership.role, "events.manage")
    : false;

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-zinc-500">{site.workspace.name}</p>
            <h2 className="text-2xl font-semibold">{site.name}</h2>
            <p className="text-sm text-zinc-600">{site.domain}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{site.status}</Badge>
            {canConfigure ? <SiteConfigModal siteId={site.id} domain={site.domain} /> : null}
            <Link className="rounded-md bg-zinc-100 px-3 py-2 text-sm hover:bg-zinc-200" href="/app/sites">
              Back to sites
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="text-sm text-zinc-500">Active users (30d)</p>
          <p className="mt-1 text-3xl font-semibold">{topUsers.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Pageviews (30d)</p>
          <p className="mt-1 text-3xl font-semibold">{topPageviews.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Bounce rate (30d)</p>
          <p className="mt-1 text-3xl font-semibold">{topBounceRate}%</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Avg. session (30d)</p>
          <p className="mt-1 text-3xl font-semibold">{topAvgSession}s</p>
        </Card>
      </div>

      {topPageviews === 0 ? (
        <Card>
          <p className="text-sm text-zinc-600">
            No analytics data yet for this site. Install the tracking script from &quot;Config analytics&quot; and generate
            traffic.
          </p>
        </Card>
      ) : null}

      <SiteAnalyticsCharts periodData={periodData} />

      <Card>
        <h3 className="text-lg font-semibold">Top referrers</h3>
        <p className="mt-1 text-sm text-zinc-600">Most common external channels.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-2 py-2">Source</th>
                <th className="px-2 py-2">Visits</th>
                <th className="px-2 py-2">Share</th>
              </tr>
            </thead>
            <tbody>
              {referrers.map((item: (typeof referrers)[number]) => (
                <tr key={item.name} className="border-b border-zinc-100">
                  <td className="px-2 py-2">{item.name}</td>
                  <td className="px-2 py-2">{item.visits.toLocaleString()}</td>
                  <td className="px-2 py-2">{Math.round((item.visits / Math.max(totalPageviews, 1)) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
