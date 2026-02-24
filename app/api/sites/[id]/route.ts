import { NextResponse } from "next/server";

import { requireWorkspaceRoleOrResponse } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { updateSiteSchema } from "@/schemas/site";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const site = await prisma.site.findUnique({ where: { id } });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const guard = await requireWorkspaceRoleOrResponse(site.workspaceId, "ADMIN");
  if (guard.response) {
    return guard.response;
  }

  const body = await request.json();
  const parsed = updateSiteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.site.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json({ site: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const site = await prisma.site.findUnique({ where: { id } });
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const guard = await requireWorkspaceRoleOrResponse(site.workspaceId, "ADMIN");
  if (guard.response) {
    return guard.response;
  }

  await prisma.site.delete({ where: { id } });
  return NextResponse.json({ message: "Site deleted" });
}
