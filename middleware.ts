import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";

const PROTECTED_PREFIXES = ["/app", "/api/workspaces", "/api/sites", "/api/team", "/api/invites/accept"];

export default auth((req: NextRequest & { auth?: unknown }) => {
  const isProtected = PROTECTED_PREFIXES.some((prefix) => req.nextUrl.pathname.startsWith(prefix));
  if (!isProtected) {
    return NextResponse.next();
  }

  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/app/:path*", "/api/:path*"],
};
