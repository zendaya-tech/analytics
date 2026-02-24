"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AcceptInviteClient({ token }: { token: string }) {
  const router = useRouter();

  async function acceptInvite() {
    const response = await fetch("/api/invites/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      toast.error("Cannot accept invite");
      return;
    }

    toast.success("Invite accepted");
    router.push("/app");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-lg space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Accept workspace invitation</h1>
        <p className="text-sm text-zinc-600">You will join the workspace once you validate the token.</p>
        <Button className="w-full" onClick={acceptInvite} disabled={!token}>
          Accept invitation
        </Button>
      </Card>
    </main>
  );
}
