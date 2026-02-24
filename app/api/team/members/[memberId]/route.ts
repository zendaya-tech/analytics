import { NextResponse } from "next/server";

import { canAssumeRole, roleRank } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { requireWorkspaceRoleOrResponse } from "@/lib/rbac";
import { updateMemberRoleSchema } from "@/schemas/workspace";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const { memberId } = await params;
  const member = await prisma.workspaceMember.findUnique({ where: { id: memberId } });
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const guard = await requireWorkspaceRoleOrResponse(member.workspaceId, "ADMIN");
  if (guard.response) {
    return guard.response;
  }

  if (member.role === "OWNER") {
    return NextResponse.json({ error: "Cannot modify owner" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = updateMemberRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!canAssumeRole(guard.membership.role, parsed.data.role)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  if (guard.membership.role !== "OWNER" && roleRank[member.role] >= roleRank[guard.membership.role]) {
    return NextResponse.json({ error: "Cannot manage this member" }, { status: 403 });
  }

  const updated = await prisma.workspaceMember.update({
    where: { id: member.id },
    data: {
      role: parsed.data.role,
    },
  });

  return NextResponse.json({ member: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ memberId: string }> },
) {
  const { memberId } = await params;
  const member = await prisma.workspaceMember.findUnique({ where: { id: memberId } });
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  const guard = await requireWorkspaceRoleOrResponse(member.workspaceId, "ADMIN");
  if (guard.response) {
    return guard.response;
  }

  if (member.role === "OWNER") {
    return NextResponse.json({ error: "Cannot remove owner" }, { status: 403 });
  }

  if (guard.membership.role !== "OWNER" && roleRank[member.role] >= roleRank[guard.membership.role]) {
    return NextResponse.json({ error: "Cannot manage this member" }, { status: 403 });
  }

  await prisma.workspaceMember.delete({ where: { id: member.id } });
  return NextResponse.json({ message: "Member removed" });
}
