"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, Home, LayoutDashboard, Settings2, Users } from "lucide-react";

import { cn } from "@/lib/utils";

function navClass(active: boolean) {
  return cn(
    "flex items-center gap-2 rounded-lg px-3 py-2 font-medium transition",
    active
      ? "bg-violet-600 text-white shadow-sm"
      : "bg-white text-zinc-700 hover:bg-violet-100 hover:text-violet-800",
  );
}

function isPathActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="mt-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-violet-500">Pour vous</p>
        <nav className="space-y-2 text-sm">
          <Link className={navClass(isPathActive(pathname, "/app"))} href="/app">
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <Link className={navClass(isPathActive(pathname, "/"))} href="/">
            <Home className="size-4" />
            Landing page
          </Link>
        </nav>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-violet-500">Pour le workspace</p>
        <nav className="space-y-2 text-sm">
          <Link className={navClass(isPathActive(pathname, "/app/workspaces"))} href="/app/workspaces">
            <Settings2 className="size-4" />
            Workspaces
          </Link>
          <Link className={navClass(isPathActive(pathname, "/app/sites"))} href="/app/sites">
            <Globe className="size-4" />
            Sites
          </Link>
          <Link className={navClass(isPathActive(pathname, "/app/team"))} href="/app/team">
            <Users className="size-4" />
            Team
          </Link>
        </nav>
      </div>
    </>
  );
}
