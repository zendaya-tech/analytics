import { AcceptInviteClient } from "@/components/accept-invite-client";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  return <AcceptInviteClient token={params.token ?? ""} />;
}
