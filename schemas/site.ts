import { SiteStatus } from "@prisma/client";
import { z } from "zod";

export const createSiteSchema = z.object({
  workspaceId: z.string().cuid(),
  name: z.string().trim().min(2).max(80),
  domain: z.string().trim().toLowerCase().min(4).max(255),
  timezone: z.string().trim().min(2).max(64),
  status: z.nativeEnum(SiteStatus).optional(),
});

export const updateSiteSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  domain: z.string().trim().toLowerCase().min(4).max(255).optional(),
  timezone: z.string().trim().min(2).max(64).optional(),
  status: z.nativeEnum(SiteStatus).optional(),
});
