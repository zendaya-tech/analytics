import { addMinutes } from "date-fns";
import { NextResponse } from "next/server";

import { hashToken, generatePlainToken } from "@/lib/security";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/schemas/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
  });

  if (user) {
    const token = generatePlainToken(24);
    const tokenHash = hashToken(token);
    const expiresAt = addMinutes(new Date(), 30);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    return NextResponse.json({
      message: "If the email exists, a reset link has been generated.",
      resetUrl: `/reset-password?token=${token}`,
    });
  }

  return NextResponse.json({
    message: "If the email exists, a reset link has been generated.",
  });
}
