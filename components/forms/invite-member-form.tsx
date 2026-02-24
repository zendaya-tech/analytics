"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { inviteSchema } from "@/schemas/workspace";

type FormValues = z.infer<typeof inviteSchema>;

export function InviteMemberForm({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      role: "VIEWER",
    },
  });

  async function onSubmit(values: FormValues) {
    const response = await fetch(`/api/workspaces/${workspaceId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok) {
      toast.error(payload.error ?? "Cannot send invitation");
      return;
    }

    toast.success("Invitation sent", {
      description: payload.acceptUrl,
    });
    form.reset({ email: "", role: "VIEWER" });
    router.refresh();
  }

  return (
    <form className="grid gap-3 md:grid-cols-4" onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="member@company.com" {...form.register("email")} />
      <Controller
        control={form.control}
        name="role"
        render={({ field }) => (
          <Dropdown
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: "ADMIN", label: "ADMIN" },
              { value: "ANALYST", label: "ANALYST" },
              { value: "VIEWER", label: "VIEWER" },
            ]}
          />
        )}
      />
      <div className="md:col-span-2">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Send invite
        </Button>
      </div>
    </form>
  );
}
