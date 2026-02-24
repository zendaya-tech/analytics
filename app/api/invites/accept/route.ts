import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";
import { setActiveWorkspace } from "@/lib/workspace";
import { acceptInviteSchema } from "@/schemas/invite";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = acceptInviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const tokenHash = hashToken(parsed.data.token);
  const invite = await prisma.invite.findUnique({
    where: { tokenHash },
  });

  if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
    return NextResponse.json({ error: "Invite invalid or expired" }, { status: 400 });
  }

  if (invite.email !== session.user.email.toLowerCase()) {
    return NextResponse.json(
      { error: "Invite email does not match your account" },
      { status: 403 },
    );
  }

  await prisma.$transaction([
    prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId: invite.workspaceId,
          userId: session.user.id,
        },
      },
      update: {
        role: invite.role,
      },
      create: {
        workspaceId: invite.workspaceId,
        userId: session.user.id,
        role: invite.role,
      },
    }),
    prisma.invite.update({
      where: { id: invite.id },
      data: {
        status: "ACCEPTED",
        acceptedById: session.user.id,
        acceptedAt: new Date(),
      },
    }),
  ]);

  await setActiveWorkspace(invite.workspaceId);

  return NextResponse.json({ message: "Invite accepted", workspaceId: invite.workspaceId });
}
