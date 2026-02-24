import { InviteMemberForm } from "@/components/forms/invite-member-form";
import { InviteActions, TeamMemberActions } from "@/components/team-member-actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { hasPermission, roleRank } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { resolveActiveWorkspace } from "@/lib/workspace";

export default async function TeamPage() {
  const active = await resolveActiveWorkspace();
  if (!active) {
    return (
      <Card>
        <p>Create a workspace to invite members.</p>
      </Card>
    );
  }

  const canManage = hasPermission(active.role, "members.manage");

  const [members, invites] = await Promise.all([
    prisma.workspaceMember.findMany({
      where: { workspaceId: active.workspaceId },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.invite.findMany({
      where: { workspaceId: active.workspaceId, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-4">
      {canManage ? (
        <Card>
          <h2 className="text-xl font-semibold">Invite member</h2>
          <p className="mb-4 mt-1 text-sm text-zinc-600">Token is hashed in DB and expires in 7 days.</p>
          <InviteMemberForm workspaceId={active.workspaceId} />
        </Card>
      ) : null}

      <Card>
        <h2 className="text-xl font-semibold">Members</h2>
        <div className="mt-4 space-y-2">
          {members.map((member: (typeof members)[number]) => (
            <div
              key={member.id}
              className="flex flex-col gap-2 rounded-lg border border-zinc-200 px-4 py-3 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-medium">{member.user.email}</p>
                <p className="text-sm text-zinc-500">{member.user.name ?? "No name"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{member.role}</Badge>
                <TeamMemberActions
                  memberId={member.id}
                  currentRole={member.role}
                  canManage={
                    canManage &&
                    member.role !== "OWNER" &&
                    (active.role === "OWNER" || roleRank[active.role] > roleRank[member.role])
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Pending invitations</h2>
        <div className="mt-4 space-y-2">
          {invites.length === 0 ? (
            <p className="text-sm text-zinc-600">No pending invites.</p>
          ) : (
            invites.map((invite: (typeof invites)[number]) => (
              <div
                key={invite.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{invite.email}</p>
                  <p className="text-sm text-zinc-500">Role: {invite.role}</p>
                </div>
                {canManage ? <InviteActions inviteId={invite.id} /> : null}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
