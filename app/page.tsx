import Link from "next/link";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();
  const primaryHref = session?.user ? "/app" : "/signup";

  return (
    <main className="w-full">
      <header className="w-full bg-white/95 px-4 py-3 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <p className="text-2xl font-bold text-zinc-900">Zendaya Analytics</p>
          <nav className="flex items-center gap-4 text-sm text-zinc-600">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" className="h-9">
                Sign in
              </Button>
            </Link>
            <Link href={primaryHref}>
              <Button className="h-9 bg-violet-600 hover:bg-violet-700">
                {session?.user ? "Open app" : "Start free"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto mt-5 max-w-7xl rounded-3xl bg-white/85 p-4 md:p-6">

        <div className="mt-5">
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50 p-6 md:p-8">
            <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
              Analytics platform for publishers
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-zinc-900 md:text-6xl">
              Google Analytics Alternative Built for Modern SaaS Teams
            </h1>
            <p className="mt-4 max-w-2xl text-zinc-600">
              Organize analytics by workspace, control team access with strict roles, and track sites from one clean
              dashboard.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={primaryHref}>
                <Button className="bg-violet-600 hover:bg-violet-700">Get started now</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Watch demo</Button>
              </Link>
            </div>

            <div className="mt-7 rounded-xl border border-zinc-200 bg-white p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["42,080", "Active users"],
                  ["66,553", "Events / day"],
                  ["85%", "Invite acceptance"],
                  ["00:00:56", "Session duration"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg bg-zinc-50 p-3">
                    <p className="text-2xl font-bold text-zinc-900">{value}</p>
                    <p className="text-xs text-zinc-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-violet-100 bg-white p-5">
              <p className="text-sm text-zinc-500">Active users</p>
              <p className="mt-1 text-4xl font-bold text-zinc-900">5k+</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white p-5">
              <p className="text-sm text-zinc-500">Tracking pageviews</p>
              <p className="mt-1 text-4xl font-bold text-zinc-900">10B+</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white p-5">
              <p className="text-sm text-zinc-500">Bounce drop</p>
              <p className="mt-1 text-4xl font-bold text-zinc-900">81%</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 p-5">
            <p className="text-zinc-700">
              Zendaya Analytics transformed our analytics workflow. Permissions are clear, onboarding is faster, and data is
              finally organized by workspace.
            </p>
            <p className="mt-3 text-sm font-medium text-zinc-900">Jane Doe - Founder at Zenith</p>
          </div>
          <div id="pricing" className="rounded-2xl border border-violet-100 bg-white p-5">
            <h3 className="text-3xl font-bold text-zinc-900">Simple pricing for teams</h3>
            <p className="mt-2 text-sm text-zinc-600">Start free, then scale per workspace as your traffic grows.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={primaryHref}>
                <Button className="bg-violet-600 hover:bg-violet-700">Start free</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Book demo</Button>
              </Link>
            </div>
          </div>
        </div>

        <section id="faq" className="mt-5 rounded-2xl border border-violet-100 bg-white p-5">
          <h3 className="text-3xl font-bold text-zinc-900">FAQ</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">Can I manage multiple workspaces? Yes.</div>
            <div className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">Do invites expire? Yes, automatically.</div>
          </div>
        </section>
      </section>

      <footer className="mt-10 border-t border-zinc-200 px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 text-sm text-zinc-600 md:flex-row md:items-center">
          <p className="font-medium text-zinc-900">Zendaya Analytics</p>
          <p>© {new Date().getFullYear()} Zendaya Analytics. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
