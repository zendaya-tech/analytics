import type { WorkspaceRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { roleRank } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function getMembershipForWorkspace(workspaceId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: session.user.id,
      },
    },
    include: {
      workspace: true,
      user: true,
    },
  });
}

export async function requireWorkspaceRole(workspaceId: string, minRole: WorkspaceRole) {
  const membership = await getMembershipForWorkspace(workspaceId);
  if (!membership) {
    throw new Error("Unauthorized");
  }

  if (roleRank[membership.role] < roleRank[minRole]) {
    throw new Error("Forbidden");
  }

  return membership;
}

export async function requireWorkspaceRoleOrResponse(workspaceId: string, minRole: WorkspaceRole) {
  try {
    const membership = await requireWorkspaceRole(workspaceId, minRole);
    return { membership };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Forbidden";
    return {
      response: NextResponse.json(
        { error: message },
        { status: message === "Unauthorized" ? 401 : 403 },
      ),
    };
  }
}
