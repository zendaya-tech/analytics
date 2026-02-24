import { NextResponse } from "next/server";

import { requireWorkspaceRoleOrResponse } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { createSiteSchema } from "@/schemas/site";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  }

  const guard = await requireWorkspaceRoleOrResponse(workspaceId, "VIEWER");
  if (guard.response) {
    return guard.response;
  }

  const sites = await prisma.site.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items: sites });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createSiteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const guard = await requireWorkspaceRoleOrResponse(parsed.data.workspaceId, "ADMIN");
  if (guard.response) {
    return guard.response;
  }

  const site = await prisma.site.create({
    data: {
      workspaceId: parsed.data.workspaceId,
      name: parsed.data.name,
      domain: parsed.data.domain,
      timezone: parsed.data.timezone,
      status: parsed.data.status ?? "ACTIVE",
    },
  });

  return NextResponse.json({ site }, { status: 201 });
}
