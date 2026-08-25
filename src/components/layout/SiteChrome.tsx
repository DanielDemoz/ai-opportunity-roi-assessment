import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          AI Opportunity Assessment
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/assess" className="text-slate-600 hover:text-slate-900">
            Assessment
          </Link>
          <Link
            href="/assess"
            className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-900"
          >
            Start
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-slate-500 sm:px-6">
        <p>Vendor-neutral • Business-focused • Evidence-informed</p>
        <p className="mt-2 text-xs">
          Scenario-based estimates only — not financial forecasts or guaranteed savings.
        </p>
      </div>
    </footer>
  );
}
