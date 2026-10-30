import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find Where AI Can Create Real Business Value
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Identify practical AI opportunities, estimate potential ROI, and prioritize
          the initiatives worth testing.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            href="/assess"
            className="rounded-lg bg-slate-800 px-8 py-3 text-lg font-medium text-white hover:bg-slate-900"
          >
            Start Free Assessment
          </Link>
          <p className="text-sm text-slate-500">No technical expertise required.</p>
          <p className="text-xs text-slate-400">
            Vendor-neutral • Business-focused • Evidence-informed
          </p>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <FeatureCard
          title="Business-first"
          description="We don't assume AI is the answer. Opportunities are matched to your actual pain points and processes."
        />
        <FeatureCard
          title="Transparent ROI"
          description="Value and ROI shown as ranges with full explainability, estimates, not guarantees."
        />
        <FeatureCard
          title="Governance-aware"
          description="Risk and feasibility scored separately so high ROI can't override high-risk recommendations."
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-slate-900">
          How this differs from other assessments
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="font-medium text-slate-800">This tool</p>
            <p className="mt-1 text-slate-600">
              Where should we use AI, and is it worth it?
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-800">Vendor Selection Advisor</p>
            <p className="mt-1 text-slate-600">Which AI solution should we choose?</p>
          </div>
          <div>
            <p className="font-medium text-slate-800">Governance Readiness</p>
            <p className="mt-1 text-slate-600">Are we ready to govern AI?</p>
          </div>
        </div>
      </section>

      <section className="text-center text-sm text-slate-500">
        <p>
          AI adoption should begin with a business problem and measurable value, not
          with the technology.
        </p>
      </section>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
