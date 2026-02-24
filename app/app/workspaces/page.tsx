import { CreateWorkspaceForm } from "@/components/forms/create-workspace-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export default async function WorkspacesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: user.id },
    include: { workspace: true },
    orderBy: {
      workspace: {
        createdAt: "desc",
      },
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <h2 className="text-xl font-semibold">Create workspace</h2>
        <p className="mb-4 mt-1 text-sm text-zinc-600">Each workspace has isolated data and role scopes.</p>
        <CreateWorkspaceForm />
      </Card>
      <Card>
        <h2 className="text-xl font-semibold">Your workspaces</h2>
        <div className="mt-4 space-y-2">
          {memberships.length === 0 ? (
            <p className="text-sm text-zinc-600">No workspace found.</p>
          ) : (
            memberships.map((membership: (typeof memberships)[number]) => (
              <div
                key={membership.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{membership.workspace.name}</p>
                  <p className="text-sm text-zinc-500">{membership.workspace.slug}</p>
                </div>
                <Badge>{membership.role}</Badge>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
