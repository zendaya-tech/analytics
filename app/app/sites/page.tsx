import Link from "next/link";

import { CreateSiteForm } from "@/components/forms/create-site-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { hasPermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { resolveActiveWorkspace } from "@/lib/workspace";

export default async function SitesPage() {
  const active = await resolveActiveWorkspace();
  if (!active) {
    return (
      <Card>
        <p>Create a workspace to manage sites.</p>
      </Card>
    );
  }

  const canManage = hasPermission(active.role, "sites.manage");

  const sites = await prisma.site.findMany({
    where: { workspaceId: active.workspaceId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      {canManage ? (
        <Card>
          <h2 className="text-xl font-semibold">Add site</h2>
          <p className="mb-4 mt-1 text-sm text-zinc-600">Each site is isolated by workspaceId.</p>
          <CreateSiteForm workspaceId={active.workspaceId} />
        </Card>
      ) : null}
      <Card>
        <h2 className="text-xl font-semibold">Sites in {active.workspace.name}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Domain</th>
                <th className="px-2 py-2">Timezone</th>
                <th className="px-2 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site: (typeof sites)[number]) => (
                <tr key={site.id} className="border-b border-zinc-100">
                  <td className="px-2 py-2">
                    <Link className="font-medium text-violet-700 hover:underline" href={`/app/sites/${site.id}`}>
                      {site.name}
                    </Link>
                  </td>
                  <td className="px-2 py-2">{site.domain}</td>
                  <td className="px-2 py-2">{site.timezone}</td>
                  <td className="px-2 py-2">
                    <Badge>{site.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
