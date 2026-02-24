"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { createSiteSchema } from "@/schemas/site";

const formSchema = createSiteSchema.pick({
  name: true,
  domain: true,
  timezone: true,
  status: true,
});

type FormValues = z.infer<typeof formSchema>;

export function CreateSiteForm({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      domain: "",
      timezone: "Europe/Paris",
      status: "ACTIVE",
    },
  });

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workspaceId,
        ...values,
      }),
    });

    if (!response.ok) {
      toast.error("Failed to create site");
      return;
    }

    toast.success("Site created");
    form.reset({
      name: "",
      domain: "",
      timezone: "Europe/Paris",
      status: "ACTIVE",
    });
    router.refresh();
  }

  return (
    <form className="grid gap-3 md:grid-cols-5" onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="Site name" {...form.register("name")} />
      <Input placeholder="domain.com" {...form.register("domain")} />
      <Input placeholder="Europe/Paris" {...form.register("timezone")} />
      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <Dropdown
            value={field.value ?? "ACTIVE"}
            onChange={field.onChange}
            options={[
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "PAUSED", label: "PAUSED" },
              { value: "ARCHIVED", label: "ARCHIVED" },
            ]}
          />
        )}
      />
      <Button type="submit" disabled={form.formState.isSubmitting}>
        Add site
      </Button>
    </form>
  );
}
