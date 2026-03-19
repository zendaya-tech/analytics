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
<><main className="pt-24"><section className="relative px-6 py-20 lg:py-32 overflow-hidden">
<div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-20">
<div className="absolute top-20 right-0 w-96 h-96 bg-primary-fixed-dim rounded-full blur-[120px]"></div>
<div className="absolute bottom-0 right-20 w-80 h-80 bg-secondary-fixed rounded-full blur-[100px]"></div>
</div>
<div className="max-w-screen-2xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
<div className="space-y-8">
<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-sm font-bold tracking-wide">
<span className="material-symbols-outlined text-base">auto_awesome</span>
                        VIOLET PRECISION V2.0 IS LIVE
                    </div>
<h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-on-surface leading-[1.1]">
<span className="text-primary">Decode</span> Your <br/>
                        Digital Growth
                    </h1>
<p className="text-xl text-on-surface-variant max-w-xl font-medium leading-relaxed">
                        Transition from messy data to clear insights. Zendaya Analytics provides the ethereal clarity required for rigorous business decisions.
                    </p>
<div className="flex flex-wrap gap-4 pt-4">
<button className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/25 hover:bg-primary-container transition-all active:scale-95">
                            GET STARTED FOR FREE
                        </button>
<button className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-primary hover:bg-surface-container-low transition-all">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                            Watch Demo
                        </button>
</div>
<div className="flex items-center gap-6 pt-8">
<div className="flex -space-x-3">
<img className="w-10 h-10 rounded-full border-2 border-surface" data-alt="User testimonial avatar portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg8WMpuiRrWX290eQklsqhqVHh83r9b-HWvlyNelGSERCHHsAHHoQHiqRizZxyJ4xaIyXclSM2BN-vPMFP4iw-00em4OJr8koZh3ZCCgyRr5QYrQPrDkS7ZoMWEl6_2y5D4J_hKTtDzgc-neFbFIge29eDPe2uSFElq0_sZ1uk6O6hjRGC9eEgrg1uOhFxeiNIvPp5Le_j3-9Nt_HD6gfkKztHgPatKn49tWN-67O4H7fd3qYkaTB_x48B5HxswZrSB2fEFCAAMjE9"/>
<img className="w-10 h-10 rounded-full border-2 border-surface" data-alt="User testimonial avatar portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnwGULXDL_CjH1d8XSEKNIHcF4U6ps9fYPkq2eTDqaFcSQ-wI6x15xTvJnXZAj8VDTGoIpPB7nRDzcDcJ1UtJgGZQKNbAh-H-CZse7p4J3LKf_i0fZO2MrL_Mz2ZMZYrlkTUJKf8ZZfu1Nk-pNIdUNwPcSPZD5HYWgCo6o2jilFKCi1qRkEkkMPhEq43aq9WzcrSa4sHF4dG5kp7IeM4v2PvOOjTY6VgdbJlTpeA-yZhVEmgdQvXVsUzJFRl_JSd0ItbQX4Va_ANPG"/>
<img className="w-10 h-10 rounded-full border-2 border-surface" data-alt="User testimonial avatar portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkzaLNU2AAugg7iQ60W7ZdAJ-hZ74A-NNrJ8toOYO_CNKhkjar0sDPdk0S5sypRUCKUxUzbpt1U6c390O040saVv1mJlr_sKGDoWQgQv6oZulMKRWbIAzCPxzkZoJAeIFpcrtkkKIHLIP99lMkTbFBxMyMxx9TL2iMISOJrWpRa7UvsV_Cz265O2VqUX1warTpba64wOkLCf5MbZYJDL5KzGKGwcX0ECNARvafK_cPNOebbLKxPwFxPI9_MAmcH_BmH_O9rUs3pzzz"/>
</div>
<p className="text-sm font-semibold text-on-surface-variant">Trusted by 2,000+ scaling teams worldwide</p>
</div>
</div>
<div className="grid grid-cols-6 gap-4 h-[500px]">
<div className="col-span-4 row-span-3 bg-surface-container-lowest rounded-lg shadow-sm p-6 border-outline-variant/10 flex flex-col justify-between">
<div className="flex justify-between items-start">
<div>
<p className="text-xs font-bold text-outline uppercase tracking-widest">Active Velocity</p>
<h3 className="text-3xl font-extrabold text-on-surface mt-1">+24.8%</h3>
</div>
<span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
</div>
<div className="mt-4 h-32 bg-surface-container-low rounded-lg relative overflow-hidden">
<div className="absolute inset-0 opacity-20 bg-gradient-to-t from-primary to-transparent"></div>
<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-1 h-16">
<div className="w-full bg-primary/40 rounded-t-sm h-1/2"></div>
<div className="w-full bg-primary/40 rounded-t-sm h-3/4"></div>
<div className="w-full bg-primary/60 rounded-t-sm h-full"></div>
<div className="w-full bg-primary/40 rounded-t-sm h-2/3"></div>
<div className="w-full bg-primary/50 rounded-t-sm h-4/5"></div>
<div className="w-full bg-primary/70 rounded-t-sm h-5/6"></div>
</div>
</div>
</div>
<div className="col-span-2 row-span-2 bg-secondary-container text-on-secondary-container rounded-lg p-5 flex flex-col justify-center items-center text-center">
<span className="material-symbols-outlined text-4xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
<p className="text-sm font-bold">Predictive Engines</p>
</div>
<div className="col-span-2 row-span-2 bg-surface-container-high rounded-lg p-5 flex flex-col justify-end">
<p className="text-xs font-bold text-outline">LATENCY</p>
<p className="text-xl font-bold text-primary">1.2ms</p>
</div>
<div className="col-span-4 row-span-1 bg-surface-container rounded-lg p-4 flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center">
<span className="material-symbols-outlined text-primary">verified_user</span>
</div>
<p className="text-sm font-bold text-on-surface">Precision-Grade Security Protocol</p>
</div>
</div>
</div>
</section>
<section className="bg-surface-container-low py-24 px-6">
<div className="max-w-screen-2xl mx-auto">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
<div className="max-w-2xl">
<h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4 leading-tight">Engineered for Precision</h2>
<p className="text-lg text-on-surface-variant">Our architecture is built on the philosophy of &apos;Analytical Ethereality&apos;-where complex operations meet effortless interface design.</p>
</div>
<div className="flex gap-4">
<div className="p-3 bg-surface-container-lowest rounded-full shadow-sm text-primary">
<span className="material-symbols-outlined">query_stats</span>
</div>
<div className="p-3 bg-surface-container-lowest rounded-full shadow-sm text-primary">
<span className="material-symbols-outlined">hub</span>
</div>
</div>
</div>
<div className="grid md:grid-cols-3 gap-8">
<div className="bg-surface-container-lowest p-10 rounded-lg group hover:bg-surface-bright transition-all">
<div className="w-14 h-14 bg-tertiary-fixed rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary-fixed-dim transition-colors">
<span className="material-symbols-outlined text-primary text-3xl">monitoring</span>
</div>
<h3 className="text-xl font-bold text-on-surface mb-3">Real-time Telemetry</h3>
<p className="text-on-surface-variant leading-relaxed">Instantly capture every event with zero-latency streaming. Observe market shifts the moment they occur.</p>
</div>
<div className="bg-surface-container-lowest p-10 rounded-lg group hover:bg-surface-bright transition-all">
<div className="w-14 h-14 bg-tertiary-fixed rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary-fixed-dim transition-colors">
<span className="material-symbols-outlined text-primary text-3xl">psychology</span>
</div>
<h3 className="text-xl font-bold text-on-surface mb-3">AI Context Layer</h3>
<p className="text-on-surface-variant leading-relaxed">Our models don&apos;t just find patterns; they understand business intent, filtering noise from actionable signals.</p>
</div>
<div className="bg-surface-container-lowest p-10 rounded-lg group hover:bg-surface-bright transition-all">
<div className="w-14 h-14 bg-tertiary-fixed rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary-fixed-dim transition-colors">
<span className="material-symbols-outlined text-primary text-3xl">dataset</span>
</div>
<h3 className="text-xl font-bold text-on-surface mb-3">Omni-Channel Sync</h3>
<p className="text-on-surface-variant leading-relaxed">Integrate data from across your stack—CRM, ERP, and Social—into a single source of analytical truth.</p>
</div>
</div>
</div>
</section>
<section className="py-24 px-6 relative">
<div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-surface-container-low to-transparent -z-10"></div>
<div className="max-w-4xl mx-auto text-center space-y-12">
<div className="flex justify-center gap-1 text-primary">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<blockquote className="text-3xl lg:text-4xl font-bold text-on-surface tracking-tight leading-snug italic">
                    &quot;Zendaya Analytics has transformed our data from a burden into a competitive advantage. The precision of the interface is unmatched in the industry.&quot;
                </blockquote>
<div className="flex flex-col items-center gap-4">
<img className="w-16 h-16 rounded-full ring-4 ring-primary-fixed-dim" data-alt="CEO of a tech startup portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3hyD4ddor3W0KyrcKuc9HxliC0dP7DW-BhMeb5ga7nxGr9o885trWubER7Vjgi5B44wRfE-0ctVd3huRTrJB2SHjMfLUCqZhZa2Rf4uss7LHs7CBMJVAKOSW30fworSVTL2RYNNw-ameJPNqbmU-4yeso0VVbLE_wjJHCp65xhfiwDJTBJKJeEce3MvaYJRUmEw_k-vg-en7WOurxY5gOWXeBFaMouTmSoJKQqCT5jk2gf_WNlcmBDNdMUqZm2iqCPfPsz1dNhicZ"/>
<div>
<p className="font-extrabold text-on-surface text-lg">Marcus Thorne</p>
<p className="text-primary font-bold tracking-widest text-xs uppercase">CTO, Ethereal Systems</p>
</div>
</div>
</div>
</section>
{/* Final CTA */}
<section className="max-w-screen-2xl mx-auto px-6 pb-24">
<div className="bg-primary-container rounded-lg p-12 lg:p-20 relative overflow-hidden shadow-2xl shadow-primary/30">
<div className="absolute top-0 right-0 p-20 opacity-10">
<span className="material-symbols-outlined text-[300px]" style={{ fontVariationSettings: "'wght' 100" }}>analytics</span>
</div>
<div className="relative z-10 max-w-2xl">
<h2 className="text-4xl lg:text-5xl font-extrabold text-on-primary-container leading-tight mb-6">Ready to decode your future?</h2>
<p className="text-xl text-primary-fixed-dim mb-10">Join the world&apos;s most analytical teams and start making data-driven decisions today.</p>
<div className="flex flex-wrap gap-4">
<button className="bg-surface-container-lowest text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-surface-bright transition-all active:scale-95">
                            Start Your Free Trial
                        </button>
<button className="border-2 border-primary-fixed-dim text-on-primary-container px-10 py-4 rounded-full font-bold text-lg hover:bg-on-primary/10 transition-all">
                            Contact Sales
                        </button>
</div>
</div>
</div>
</section>
</main>
<footer className="bg-[#f9f1ff] dark:bg-[#16131c] w-full mt-auto py-12 font-['Manrope'] text-sm tracking-wide">
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-10 w-full max-w-screen-2xl mx-auto">
<div className="space-y-4">
<span className="font-bold text-violet-800 dark:text-violet-200 text-lg">Zendaya Analytics</span>
<p className="text-slate-500 dark:text-slate-500 max-w-sm">
                    Leveraging analytical ethereality to provide business intelligence for the next generation of digital pioneers.
                </p>
<p className="text-slate-500 dark:text-slate-500">
                    © 2024 Zendaya Analytics. Analytical Ethereality.
                </p>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="space-y-4">
<p className="text-violet-600 dark:text-violet-300 font-semibold">Product</p>
<ul className="space-y-2">
<li><a className="text-slate-500 hover:text-violet-700 dark:hover:text-violet-200 underline-offset-4 hover:underline transition-opacity" href="#">Dashboard</a></li>
<li><a className="text-slate-500 hover:text-violet-700 dark:hover:text-violet-200 underline-offset-4 hover:underline transition-opacity" href="#">API Documentation</a></li>
<li><a className="text-slate-500 hover:text-violet-700 dark:hover:text-violet-200 underline-offset-4 hover:underline transition-opacity" href="#">Pricing</a></li>
</ul>
</div>
<div className="space-y-4">
<p className="text-violet-600 dark:text-violet-300 font-semibold">Company</p>
<ul className="space-y-2">
<li><a className="text-slate-500 hover:text-violet-700 dark:hover:text-violet-200 underline-offset-4 hover:underline transition-opacity" href="#">Privacy Policy</a></li>
<li><a className="text-slate-500 hover:text-violet-700 dark:hover:text-violet-200 underline-offset-4 hover:underline transition-opacity" href="#">Terms of Service</a></li>
<li><a className="text-slate-500 hover:text-violet-700 dark:hover:text-violet-200 underline-offset-4 hover:underline transition-opacity" href="#">Support</a></li>
</ul>
</div>
</div>
</div>
</footer></>
    </main>
  );
}
