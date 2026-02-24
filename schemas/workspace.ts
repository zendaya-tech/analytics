import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(2).max(80),
});

export const switchWorkspaceSchema = z.object({
  workspaceId: z.string().cuid(),
});

export const inviteSchema = z.object({
  email: z.email().transform((value: string) => value.toLowerCase()),
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["ADMIN", "ANALYST", "VIEWER"]),
});
