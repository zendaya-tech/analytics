import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireWorkspaceRoleOrResponse } from "@/lib/rbac";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ inviteId: string }> },
) {
  const { inviteId } = await params;
  const invite = await prisma.invite.findUnique({ where: { id: inviteId } });
  if (!invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  const guard = await requireWorkspaceRoleOrResponse(invite.workspaceId, "ADMIN");
  if (guard.response) {
    return guard.response;
  }

  if (invite.status !== "PENDING") {
    return NextResponse.json({ error: "Invite is not pending" }, { status: 400 });
  }

  const updated = await prisma.invite.update({
    where: { id: invite.id },
    data: { status: "REVOKED" },
  });

  return NextResponse.json({ invite: updated });
}
