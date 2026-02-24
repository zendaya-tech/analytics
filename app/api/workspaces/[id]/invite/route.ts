import { addDays } from "date-fns";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { canAssumeRole } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { requireWorkspaceRoleOrResponse } from "@/lib/rbac";
import { generatePlainToken, hashToken } from "@/lib/security";
import { inviteSchema } from "@/schemas/workspace";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: workspaceId } = await params;
  const guard = await requireWorkspaceRoleOrResponse(workspaceId, "ADMIN");
  if (guard.response) {
    return guard.response;
  }

  const rateLimit = enforceRateLimit(`invite:${session.user.id}:${workspaceId}`, {
    max: 10,
    windowMs: 60_000,
  });
  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: "Too many invite requests. Try again in a minute.",
      },
      { status: 429 },
    );
  }

  const body = await request.json();
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (!canAssumeRole(guard.membership.role, parsed.data.role)) {
    return NextResponse.json(
      {
        error: "You cannot invite this role",
      },
      { status: 403 },
    );
  }

  const token = generatePlainToken(24);
  const tokenHash = hashToken(token);
  const expiresAt = addDays(new Date(), 7);

  const invite = await prisma.invite.create({
    data: {
      workspaceId,
      email: parsed.data.email,
      role: parsed.data.role,
      invitedById: session.user.id,
      tokenHash,
      expiresAt,
    },
  });

  return NextResponse.json(
    {
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      },
      acceptUrl: `/accept-invite?token=${token}`,
    },
    { status: 201 },
  );
}
