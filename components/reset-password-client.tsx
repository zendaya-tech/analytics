"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "@/schemas/auth";

const formSchema = resetPasswordSchema.pick({
  password: true,
});

type FormValues = z.infer<typeof formSchema>;

export function ResetPasswordClient({ token }: { token: string }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password: values.password }),
    });

    if (!response.ok) {
      toast.error("Invalid or expired token");
      return;
    }

    toast.success("Password updated");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Choose a new password</h1>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="New password" type="password" {...form.register("password")} />
          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting || !token}>
            Save password
          </Button>
        </form>
        <Link className="text-sm text-violet-700 hover:underline" href="/login">
          Back to login
        </Link>
      </Card>
    </main>
  );
}
