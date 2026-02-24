import { LoginClient } from "@/components/login-client";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const params = await searchParams;
  return <LoginClient callbackUrl={params.callbackUrl ?? "/app"} />;
}
