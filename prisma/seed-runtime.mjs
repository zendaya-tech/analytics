import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const email = process.env.SEED_OWNER_EMAIL || "owner@example.com";
  const defaultPasswordHash = "$2b$12$eQeyIuc0fFTEE8PR8O679OwRe4H.pJHTuVZtJ.xVjjW9Z7s7DB.tO";
  const passwordHash = process.env.SEED_OWNER_PASSWORD_HASH || defaultPasswordHash;
  const workspaceName = process.env.SEED_WORKSPACE_NAME || "Demo Workspace";
  const workspaceSlug = process.env.SEED_WORKSPACE_SLUG || "demo-workspace";
  const siteDomain = process.env.SEED_SITE_DOMAIN || "demo.example.com";

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: "Workspace Owner",
      passwordHash,
    },
    create: {
      email,
      name: "Workspace Owner",
      passwordHash,
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { slug: workspaceSlug },
    update: {
      name: workspaceName,
      ownerId: user.id,
    },
    create: {
      name: workspaceName,
      slug: workspaceSlug,
      ownerId: user.id,
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
    update: { role: "OWNER" },
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: "OWNER",
    },
  });

  await prisma.site.upsert({
    where: {
      workspaceId_domain: {
        workspaceId: workspace.id,
        domain: siteDomain,
      },
    },
    update: {
      name: "Demo Site",
      timezone: "Europe/Paris",
      status: "ACTIVE",
    },
    create: {
      workspaceId: workspace.id,
      name: "Demo Site",
      domain: siteDomain,
      timezone: "Europe/Paris",
      status: "ACTIVE",
    },
  });

  console.log("[seed] Runtime seed completed");
}

seed()
  .catch((error) => {
    console.error("[seed] Runtime seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
