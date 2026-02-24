import { subDays } from "date-fns";

import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { resolveActiveWorkspace } from "@/lib/workspace";

export default async function DashboardPage() {
  const active = await resolveActiveWorkspace();

  if (!active) {
    return (
      <Card>
        <h2 className="text-xl font-semibold">No workspace yet</h2>
        <p className="mt-2 text-zinc-600">Create your first workspace from the Workspaces page.</p>
      </Card>
    );
  }

  const [siteCount, memberCount, inviteCount, sites, events30d] = await Promise.all([
    prisma.site.count({ where: { workspaceId: active.workspaceId } }),
    prisma.workspaceMember.count({ where: { workspaceId: active.workspaceId } }),
    prisma.invite.count({ where: { workspaceId: active.workspaceId, status: "PENDING" } }),
    prisma.site.findMany({
      where: { workspaceId: active.workspaceId },
      select: {
        id: true,
        name: true,
        domain: true,
        status: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.analyticsEvent.findMany({
      where: {
        workspaceId: active.workspaceId,
        eventName: "page_view",
        createdAt: {
          gte: subDays(new Date(), 29),
        },
      },
      select: {
        siteId: true,
        visitorId: true,
      },
    }),
  ]);

  const totalPageviews30d = events30d.length;
  const uniqueVisitors30d = new Set(events30d.map((event) => event.visitorId ?? "anon")).size;

  const bySite = new Map<string, { views: number; visitors: Set<string> }>();
  for (const event of events30d) {
    const current = bySite.get(event.siteId) ?? { views: 0, visitors: new Set<string>() };
    current.views += 1;
    current.visitors.add(event.visitorId ?? "anon");
    bySite.set(event.siteId, current);
  }

  const siteSummaries = sites
    .map((site) => {
      const row = bySite.get(site.id) ?? { views: 0, visitors: new Set<string>() };
      return {
        ...site,
        pageviews: row.views,
        visitors: row.visitors.size,
      };
    })
    .sort((a, b) => b.pageviews - a.pageviews);

  const topVisitedSites = siteSummaries.slice(0, 5);
  const topVisitedTotal = topVisitedSites.reduce((sum, site) => sum + site.pageviews, 0);
  let offset = 0;
  const donutPalette = ["#7c3aed", "#a855f7", "#c084fc", "#8b5cf6", "#6d28d9"];
  const donutStops = topVisitedSites
    .map((site, index) => {
      const ratio = topVisitedTotal > 0 ? site.pageviews / topVisitedTotal : 0;
      const start = offset;
      const end = offset + ratio * 100;
      offset = end;
      return `${donutPalette[index % donutPalette.length]} ${start.toFixed(2)}% ${end.toFixed(2)}%`;
    })
    .join(", ");
  const donutBackground =
    topVisitedTotal > 0 ? `conic-gradient(${donutStops})` : "conic-gradient(#e5e7eb 0% 100%)";

  const activeSitesWithTraffic = siteSummaries.filter((site) => site.pageviews > 0).length;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-zinc-500">Workspace</p>
          <h2 className="mt-1 text-lg font-semibold">{active.workspace.name}</h2>
          <p className="mt-2 text-sm text-zinc-600">Role: {active.role}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Sites total</p>
          <h3 className="mt-1 text-3xl font-semibold">{siteCount}</h3>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Pageviews (30d)</p>
          <h3 className="mt-1 text-3xl font-semibold">{totalPageviews30d.toLocaleString()}</h3>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Unique visitors (30d)</p>
          <h3 className="mt-1 text-3xl font-semibold">{uniqueVisitors30d.toLocaleString()}</h3>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-zinc-500">Team members</p>
          <h3 className="mt-1 text-3xl font-semibold">{memberCount}</h3>
          <p className="mt-2 text-sm text-zinc-600">Invites pending: {inviteCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Sites with traffic (30d)</p>
          <h3 className="mt-1 text-3xl font-semibold">{activeSitesWithTraffic}</h3>
        </Card>
        <Card>
          <p className="text-sm text-zinc-500">Coverage</p>
          <h3 className="mt-1 text-3xl font-semibold">
            {siteCount > 0 ? Math.round((activeSitesWithTraffic / siteCount) * 100) : 0}%
          </h3>
          <p className="mt-2 text-sm text-zinc-600">Sites that generated traffic this month</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h3 className="text-lg font-semibold">Global site stats (30 days)</h3>
          <p className="mt-1 text-sm text-zinc-600">Simple overview per site without deep detail.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500">
                  <th className="px-2 py-2">Site</th>
                  <th className="px-2 py-2">Domain</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Pageviews</th>
                  <th className="px-2 py-2">Visitors</th>
                </tr>
              </thead>
              <tbody>
                {siteSummaries.map((site) => (
                  <tr key={site.id} className="border-b border-zinc-100">
                    <td className="px-2 py-2 font-medium">{site.name}</td>
                    <td className="px-2 py-2">{site.domain}</td>
                    <td className="px-2 py-2">{site.status}</td>
                    <td className="px-2 py-2">{site.pageviews.toLocaleString()}</td>
                    <td className="px-2 py-2">{site.visitors.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold">Top visited sites</h3>
          <p className="mt-1 text-sm text-zinc-600">Traffic share of the most visited websites.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-[170px_1fr] sm:items-center">
            <div className="mx-auto">
              <div className="grid size-40 place-items-center rounded-full" style={{ background: donutBackground }}>
                <div className="grid size-24 place-items-center rounded-full bg-white text-center">
                  <p className="text-xs text-zinc-500">Top 5</p>
                  <p className="text-sm font-semibold">{topVisitedTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              {topVisitedSites.length === 0 ? (
                <p className="text-sm text-zinc-500">No traffic data yet.</p>
              ) : (
                topVisitedSites.map((site, index) => {
                  const share = topVisitedTotal > 0 ? Math.round((site.pageviews / topVisitedTotal) * 100) : 0;
                  return (
                    <div key={site.id} className="flex items-center justify-between text-sm">
                      <span className="inline-flex items-center gap-2 text-zinc-700">
                        <span className="size-2 rounded-full" style={{ backgroundColor: donutPalette[index % donutPalette.length] }} />
                        {site.name}
                      </span>
                      <span className="font-medium text-zinc-900">{share}%</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
