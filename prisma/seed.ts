import bcrypt from "bcryptjs";
import { subDays } from "date-fns";

import { prisma } from "@/lib/prisma";

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pickOne<T>(items: T[], seed: number) {
  return items[Math.floor(seededRandom(seed) * items.length) % items.length];
}

async function seedAnalyticsEvents(siteId: string, workspaceId: string) {
  const countries = ["France", "United States", "Germany", "India", "Brazil", "United Kingdom", "Canada"];
  const sources = ["Organic search", "Direct", "Referral", "Social", "Email", "Paid"];
  const referrers = ["google.com", "linkedin.com", "newsletter", "partner.blog", "x.com", "direct"];
  const pages = ["/", "/pricing", "/features", "/blog", "/docs", "/contact", "/signup", "/about"];

  const existing = await prisma.analyticsEvent.count({ where: { siteId } });
  if (existing > 0) {
    return;
  }

  const now = new Date();
  const events: Array<{
    workspaceId: string;
    siteId: string;
    eventName: string;
    path: string;
    source: string;
    country: string;
    referrer: string;
    visitorId: string;
    sessionId: string;
    durationMs: number;
    scrollPercent: number;
    bounced: boolean;
    createdAt: Date;
  }> = [];

  for (let dayOffset = 0; dayOffset < 150; dayOffset += 1) {
    const day = subDays(now, dayOffset);
    const dayTrafficBase = 80 + Math.floor(seededRandom(dayOffset + siteId.length) * 170);

    for (let i = 0; i < dayTrafficBase; i += 1) {
      const seed = dayOffset * 1000 + i * 13 + siteId.length;
      const page = pickOne(pages, seed + 1);
      const country = pickOne(countries, seed + 2);
      const source = pickOne(sources, seed + 3);
      const referrer = source === "Direct" ? "direct" : pickOne(referrers, seed + 4);
      const bounced = seededRandom(seed + 5) < 0.28;
      const scrollPercent = bounced
        ? 10 + Math.floor(seededRandom(seed + 6) * 45)
        : 40 + Math.floor(seededRandom(seed + 7) * 60);
      const durationMs = bounced
        ? 4000 + Math.floor(seededRandom(seed + 8) * 25000)
        : 25000 + Math.floor(seededRandom(seed + 9) * 180000);
      const hour = Math.floor(seededRandom(seed + 10) * 24);
      const minute = Math.floor(seededRandom(seed + 11) * 60);
      const second = Math.floor(seededRandom(seed + 12) * 60);
      const createdAt = new Date(day);
      createdAt.setHours(hour, minute, second, 0);

      events.push({
        workspaceId,
        siteId,
        eventName: "page_view",
        path: page,
        source,
        country,
        referrer,
        visitorId: `v_${Math.floor(seededRandom(seed + 14) * 1200)}`,
        sessionId: `s_${Math.floor(seededRandom(seed + 15) * 9000)}`,
        durationMs,
        scrollPercent,
        bounced,
        createdAt,
      });
    }
  }

  const chunkSize = 1200;
  for (let offset = 0; offset < events.length; offset += chunkSize) {
    const chunk = events.slice(offset, offset + chunkSize);
    await prisma.analyticsEvent.createMany({
      data: chunk,
    });
  }
}

async function main() {
  const email = "owner@example.com";
  const passwordHash = await bcrypt.hash("Password123!", 12);

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
    where: { slug: "demo-workspace" },
    update: {
      name: "Demo Workspace",
      ownerId: user.id,
    },
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
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

  const site = await prisma.site.upsert({
    where: {
      workspaceId_domain: {
        workspaceId: workspace.id,
        domain: "demo.example.com",
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
      domain: "demo.example.com",
      timezone: "Europe/Paris",
      status: "ACTIVE",
    },
  });

  await seedAnalyticsEvents(site.id, workspace.id);

  console.log("Seed complete: owner@example.com / Password123!");
}

main()
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
