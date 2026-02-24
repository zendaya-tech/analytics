"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/auth";

type FormValues = z.infer<typeof signInSchema>;

export function LoginClient({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    if (!response || response.error) {
      toast.error("Invalid credentials");
      return;
    }

    toast.success("Logged in");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="Email" type="email" {...form.register("email")} />
          <Input placeholder="Password" type="password" {...form.register("password")} />
          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            Sign in
          </Button>
        </form>
        <div className="flex justify-between text-sm">
          <Link className="text-violet-700 hover:underline" href="/signup">
            Create account
          </Link>
          <Link className="text-violet-700 hover:underline" href="/forgot-password">
            Forgot password
          </Link>
        </div>
      </Card>
    </main>
  );
}
