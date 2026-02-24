import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { extractClientIp, resolveCountryCode } from "@/lib/geoip";
import { prisma } from "@/lib/prisma";

const trackSchema = z.object({
  siteId: z.string().cuid(),
  event: z.string().trim().min(2).max(80),
  url: z.string().url().optional(),
  path: z.string().trim().min(1).max(255).optional(),
  referrer: z.string().optional(),
  source: z.string().trim().min(2).max(80).optional(),
  country: z.string().trim().min(2).max(80).optional(),
  visitorId: z.string().trim().min(3).max(120).optional(),
  sessionId: z.string().trim().min(3).max(120).optional(),
  durationMs: z.number().int().min(0).max(600000).optional(),
  scrollPercent: z.number().int().min(0).max(100).optional(),
  bounced: z.boolean().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = trackSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tracking payload" }, { status: 400 });
  }

  const site = await prisma.site.findUnique({
    where: { id: parsed.data.siteId },
    select: {
      id: true,
      workspaceId: true,
      domain: true,
    },
  });

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "unknown";
  const clientIp = extractClientIp(requestHeaders);
  const ipCountry = resolveCountryCode(clientIp);

  const derivedPath = (() => {
    if (parsed.data.path) {
      return parsed.data.path;
    }
    if (parsed.data.url) {
      try {
        return new URL(parsed.data.url).pathname;
      } catch {
        return "/";
      }
    }
    return "/";
  })();

  const derivedSource = parsed.data.source ?? (parsed.data.referrer ? "Referral" : "Direct");
  const payloadDuration =
    typeof parsed.data.payload?.durationMs === "number" ? parsed.data.payload.durationMs : null;
  const payloadScrollPercent =
    typeof parsed.data.payload?.scrollPercent === "number" ? parsed.data.payload.scrollPercent : null;

  const normalizedDuration = parsed.data.durationMs ?? payloadDuration;
  const normalizedScroll = parsed.data.scrollPercent ?? payloadScrollPercent;

  const normalizedSource = derivedSource.toLowerCase() === "direct" && parsed.data.referrer ? "Referral" : derivedSource;

  const country = parsed.data.country && parsed.data.country !== "Unknown" ? parsed.data.country : (ipCountry ?? "Unknown");

  if (parsed.data.url) {
    try {
      const url = new URL(parsed.data.url);
      if (url.hostname !== site.domain) {
        return NextResponse.json({ error: "Tracking domain mismatch" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid tracking URL" }, { status: 400 });
    }
  }

  await prisma.analyticsEvent.create({
    data: {
      workspaceId: site.workspaceId,
      siteId: site.id,
      eventName: parsed.data.event.toLowerCase(),
      path: derivedPath,
      source: normalizedSource,
      country,
      referrer: parsed.data.referrer ?? null,
      visitorId: parsed.data.visitorId ?? null,
      sessionId: parsed.data.sessionId ?? null,
      durationMs: normalizedDuration,
      scrollPercent: normalizedScroll,
      bounced: parsed.data.bounced ?? false,
    },
  });

  await prisma.auditLog.create({
    data: {
      workspaceId: site.workspaceId,
      action: `TRACK_${parsed.data.event.toUpperCase()}`,
      resource: "SITE",
      resourceId: site.id,
      metadata: {
        siteDomain: site.domain,
        url: parsed.data.url ?? null,
        path: derivedPath,
        source: normalizedSource,
        country,
        ip: clientIp,
        referrer: parsed.data.referrer ?? null,
        payload: parsed.data.payload ?? {},
        userAgent,
      },
    },
  });

  return NextResponse.json({ ok: true });
}
