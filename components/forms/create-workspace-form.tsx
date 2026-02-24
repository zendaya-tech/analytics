"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createWorkspaceSchema } from "@/schemas/workspace";

type FormValues = z.infer<typeof createWorkspaceSchema>;

export function CreateWorkspaceForm() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      toast.error("Failed to create workspace");
      return;
    }

    toast.success("Workspace created");
    form.reset();
    router.refresh();
  }

  return (
    <form className="flex gap-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        placeholder="Nouveau workspace"
        {...form.register("name")}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Create
      </Button>
    </form>
  );
}
