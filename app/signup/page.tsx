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
import { signUpSchema } from "@/schemas/auth";

type FormValues = z.infer<typeof signUpSchema>;

export default function SignupPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      toast.error("Registration failed");
      return;
    }

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    toast.success("Account created");
    router.push("/app/workspaces");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="Name" {...form.register("name")} />
          <Input placeholder="Email" type="email" {...form.register("email")} />
          <Input placeholder="Password" type="password" {...form.register("password")} />
          <Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>
            Sign up
          </Button>
        </form>
        <p className="text-sm text-zinc-600">
          Already registered?{" "}
          <Link className="text-violet-700 hover:underline" href="/login">
            Login
          </Link>
        </p>
      </Card>
    </main>
  );
}
