import { cookies } from "next/headers";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ACTIVE_WORKSPACE_COOKIE = "active_workspace";

export async function setActiveWorkspace(workspaceId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_WORKSPACE_COOKIE, workspaceId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getActiveWorkspaceId() {
  const cookieStore = await cookies();
  const active = cookieStore.get(ACTIVE_WORKSPACE_COOKIE)?.value;
  return active ?? null;
}

export async function getUserWorkspaces() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return prisma.workspaceMember.findMany({
    where: { userId: session.user.id },
    include: {
      workspace: true,
    },
    orderBy: {
      workspace: {
        createdAt: "asc",
      },
    },
  });
}

export async function resolveActiveWorkspace() {
  const workspaces = await getUserWorkspaces();
  if (workspaces.length === 0) {
    return null;
  }

  const activeId = await getActiveWorkspaceId();
  const active = workspaces.find((item: (typeof workspaces)[number]) => item.workspaceId === activeId);
  if (active) {
    return active;
  }

  return workspaces[0];
}
