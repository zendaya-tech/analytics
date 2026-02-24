import Link from "next/link";
import { redirect } from "next/navigation";
import { Rocket } from "lucide-react";

import { auth } from "@/auth";
import { DashboardSidebarNav } from "@/components/dashboard-sidebar-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { WorkspaceSwitcher } from "@/components/workspace-switcher";
import { Card } from "@/components/ui/card";
import { getUserWorkspaces, resolveActiveWorkspace } from "@/lib/workspace";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const active = await resolveActiveWorkspace();
  const workspaces = await getUserWorkspaces();

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 md:px-6">
      <div className="grid min-h-screen gap-6 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-4 md:h-[90vh]">
          <Card className="flex h-full flex-col border-violet-100 bg-gradient-to-b from-white to-violet-50 md:h-[90vh]">
            <p className="text-xs uppercase tracking-wide text-violet-500">Zendaya Analytics</p>
            <h1 className="mt-1 text-2xl font-bold text-zinc-900">Dashboard</h1>
            <p className="mt-2 text-sm text-zinc-600">{session.user.email}</p>

            {active ? (
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-violet-500">Workspace active</p>
                <WorkspaceSwitcher
                  activeWorkspaceId={active.workspaceId}
                  items={workspaces.map((item: (typeof workspaces)[number]) => ({
                    id: item.workspaceId,
                    name: item.workspace.name,
                    role: item.role,
                  }))}
                />
              </div>
            ) : null}

            <DashboardSidebarNav />

            <div className="mt-6 flex-1" />

            <div className="space-y-2">
              <Link href="/" className="flex items-center justify-center gap-2 rounded-md bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700">
                <Rocket className="size-4" />
                Voir le site public
              </Link>
              <SignOutButton />
            </div>
          </Card>
        </aside>

        <section className="py-6">{children}</section>
      </div>
    </div>
  );
}
