import { NextResponse } from "next/server";

import { requireWorkspaceRoleOrResponse } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { setActiveWorkspace } from "@/lib/workspace";
import { updateWorkspaceSchema } from "@/schemas/workspace";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const guard = await requireWorkspaceRoleOrResponse(id, "OWNER");
  if (guard.response) {
    return guard.response;
  }

  const body = await request.json();
  const parsed = updateWorkspaceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const workspace = await prisma.workspace.update({
    where: { id },
    data: {
      name: parsed.data.name,
    },
  });

  return NextResponse.json({ workspace });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const guard = await requireWorkspaceRoleOrResponse(id, "OWNER");
  if (guard.response) {
    return guard.response;
  }

  await prisma.workspace.delete({ where: { id } });
  return NextResponse.json({ message: "Workspace deleted" });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const guard = await requireWorkspaceRoleOrResponse(id, "VIEWER");
  if (guard.response) {
    return guard.response;
  }

  await setActiveWorkspace(id);
  return NextResponse.json({ message: "Workspace switched" });
}
