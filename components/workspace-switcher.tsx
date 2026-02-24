"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Dropdown } from "@/components/ui/dropdown";

type Item = {
  id: string;
  name: string;
  role: string;
};

export function WorkspaceSwitcher({
  items,
  activeWorkspaceId,
}: {
  items: Item[];
  activeWorkspaceId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Dropdown
      value={activeWorkspaceId}
      disabled={isPending}
      onChange={(nextWorkspaceId) => {
        startTransition(async () => {
          const response = await fetch(`/api/workspaces/${nextWorkspaceId}`, {
            method: "POST",
          });

          if (!response.ok) {
            toast.error("Unable to switch workspace");
            return;
          }

          toast.success("Workspace switched");
          router.refresh();
        });
      }}
      options={items.map((workspace) => ({
        value: workspace.id,
        label: `${workspace.name} (${workspace.role})`,
      }))}
    />
  );
}
