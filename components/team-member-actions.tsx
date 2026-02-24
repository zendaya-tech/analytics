"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";

const roles = ["ADMIN", "ANALYST", "VIEWER"];

export function TeamMemberActions({
  memberId,
  currentRole,
  canManage,
}: {
  memberId: string;
  currentRole: string;
  canManage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (!canManage) {
    return <span className="text-sm text-zinc-500">No access</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Dropdown
        className="w-32"
        value={currentRole}
        disabled={pending}
        onChange={(role) => {
          startTransition(async () => {
            const response = await fetch(`/api/team/members/${memberId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ role }),
            });

            if (!response.ok) {
              toast.error("Unable to update role");
              return;
            }

            toast.success("Role updated");
            router.refresh();
          });
        }}
        options={roles.map((role) => ({ value: role, label: role }))}
      />
      <Button
        type="button"
        variant="danger"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const response = await fetch(`/api/team/members/${memberId}`, {
              method: "DELETE",
            });
            if (!response.ok) {
              toast.error("Unable to remove member");
              return;
            }

            toast.success("Member removed");
            router.refresh();
          });
        }}
      >
        Remove
      </Button>
    </div>
  );
}

export function InviteActions({ inviteId }: { inviteId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const response = await fetch(`/api/team/invites/${inviteId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            toast.error("Unable to revoke invite");
            return;
          }

          toast.success("Invite revoked");
          router.refresh();
        });
      }}
    >
      Revoke
    </Button>
  );
}
