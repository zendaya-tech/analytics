import type { WorkspaceRole } from "@prisma/client";

export const roleRank: Record<WorkspaceRole, number> = {
  VIEWER: 1,
  ANALYST: 2,
  ADMIN: 3,
  OWNER: 4,
};

export type PermissionKey =
  | "workspace.billing"
  | "workspace.delete"
  | "members.manage"
  | "sites.manage"
  | "stats.view"
  | "segments.manage"
  | "events.manage"
  | "exports.create";

export const permissionsMap: Record<WorkspaceRole, PermissionKey[]> = {
  OWNER: [
    "workspace.billing",
    "workspace.delete",
    "members.manage",
    "sites.manage",
    "stats.view",
    "segments.manage",
    "events.manage",
    "exports.create",
  ],
  ADMIN: ["members.manage", "sites.manage", "stats.view"],
  ANALYST: ["stats.view", "segments.manage", "events.manage", "exports.create"],
  VIEWER: ["stats.view"],
};

export function hasPermission(role: WorkspaceRole, permission: PermissionKey) {
  return permissionsMap[role].includes(permission);
}

export function canAssumeRole(actorRole: WorkspaceRole, targetRole: WorkspaceRole) {
  return roleRank[actorRole] > roleRank[targetRole] || actorRole === "OWNER";
}
