"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/schemas/auth";

type FormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json();
    if (!response.ok) {
      toast.error("Cannot generate reset link");
      return;
    }

    toast.success(payload.message, {
      description: payload.resetUrl ?? "Check your email inbox.",
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="Email" type="email" {...form.register("email")} />
          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            Generate reset link
          </Button>
        </form>
        <Link className="text-sm text-violet-700 hover:underline" href="/login">
          Back to login
        </Link>
      </Card>
    </main>
  );
}
