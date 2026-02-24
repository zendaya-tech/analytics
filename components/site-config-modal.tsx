"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type OptionKey = "pageView" | "clickTracking" | "scrollDepth" | "outboundLinks";

export function SiteConfigModal({ siteId, domain }: { siteId: string; domain: string }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Record<OptionKey, boolean>>({
    pageView: true,
    clickTracking: true,
    scrollDepth: false,
    outboundLinks: false,
  });

  const enabled = useMemo(
    () =>
      Object.entries(options)
        .filter(([, value]) => value)
        .map(([key]) => key),
    [options],
  );

  const snippet = `<script>
(function () {
  const siteId = "${siteId}";
  const endpoint = "${typeof window !== "undefined" ? window.location.origin : ""}/api/track";
  const start = Date.now();
  let maxScroll = 0;
  const visitorId = localStorage.getItem("za_vid") || "vid_" + Math.random().toString(36).slice(2, 10);
  const sessionId = sessionStorage.getItem("za_sid") || "sid_" + Math.random().toString(36).slice(2, 10);
  localStorage.setItem("za_vid", visitorId);
  sessionStorage.setItem("za_sid", sessionId);

  function detectSource() {
    if (!document.referrer) return "Direct";
    if (document.referrer.includes("google")) return "Organic search";
    if (document.referrer.includes("linkedin") || document.referrer.includes("x.com")) return "Social";
    return "Referral";
  }

  function track(event, payload) {
    const data = payload || {};
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteId,
        event,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        source: detectSource(),
        visitorId,
        sessionId,
        durationMs: typeof data.durationMs === "number" ? data.durationMs : undefined,
        scrollPercent: typeof data.scrollPercent === "number" ? data.scrollPercent : undefined,
        bounced: !!data.bounced,
        payload: data,
      }),
      keepalive: true,
    });
  }

  window.zendayaTrack = track;
  track("page_view", { path: window.location.pathname });

  window.addEventListener("scroll", function () {
    const doc = document.documentElement;
    const total = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const percent = Math.round((window.scrollY / total) * 100);
    maxScroll = Math.max(maxScroll, Math.min(100, Math.max(0, percent)));
  });

  window.addEventListener("beforeunload", function () {
    const durationMs = Date.now() - start;
    track("page_exit", {
      durationMs,
      scrollPercent: maxScroll,
      bounced: durationMs < 10000,
    });
  });
})();
</script>`;

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    toast.success("Tracking snippet copied");
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Config analytics
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">Zendaya Analytics config</h3>
                <p className="mt-1 text-sm text-zinc-600">Site: {domain}</p>
              </div>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {[
                ["pageView", "Page views"],
                ["clickTracking", "Click tracking"],
                ["scrollDepth", "Scroll depth"],
                ["outboundLinks", "Outbound links"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 rounded-lg bg-zinc-50 p-3 text-sm">
                  <Checkbox
                    checked={options[key as OptionKey]}
                    onChange={(checked) => {
                      setOptions((prev) => ({
                        ...prev,
                        [key]: checked,
                      }));
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <p className="text-xs font-semibold text-zinc-700">Enabled options</p>
              <p className="mt-1 text-sm text-zinc-600">{enabled.length > 0 ? enabled.join(", ") : "None"}</p>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-zinc-900">Frontend script to install</p>
              <pre className="mt-2 max-h-64 overflow-auto rounded-lg bg-zinc-950 p-3 text-xs text-zinc-100">
                <code>{snippet}</code>
              </pre>
              <p className="mt-2 text-xs text-zinc-500">
                Add this snippet before `&lt;/body&gt;` on the target frontend app.
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={copySnippet}>Copy script</Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
