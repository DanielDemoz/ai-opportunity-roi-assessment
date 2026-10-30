"use client";

import { useState } from "react";
import type { OpportunityResult } from "@/lib/schemas";
import { Badge, Card } from "@/components/ui/primitives";
import { recommendationEmoji, recommendationLabel } from "@/engine/recommendations";
import { formatCadRange } from "@/lib/utils";

export function ExplainabilityPanel({ result }: { result: OpportunityResult }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-slate-700 underline-offset-2 hover:underline"
      >
        {open ? "Hide" : "How was this calculated?"}
      </button>
      {open && (
        <div className="mt-3 space-y-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
          <div>
            <p className="font-medium text-slate-900">Value estimate</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {result.explainability.valueSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-900">ROI estimate</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {result.explainability.roiSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-900">Feasibility factors</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {result.explainability.feasibilityFactors.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-900">Governance factors</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {result.explainability.governanceFactors.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-900">Confidence factors</p>
            <ul className="mt-1 list-inside list-disc space-y-1">
              {result.explainability.confidenceFactors.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export function OpportunityCard({ result }: { result: OpportunityResult }) {
  const recVariant =
    result.recommendation === "priority_opportunity" || result.recommendation === "pilot"
      ? "success"
      : result.recommendation === "improve_process_first"
        ? "warning"
        : result.recommendation === "not_recommended"
          ? "danger"
          : "info";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {result.opportunity.category}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {result.opportunity.name}
          </h3>
          <p className="mt-2 text-sm text-slate-600">{result.opportunity.description}</p>
        </div>
        <Badge variant={recVariant}>
          {recommendationEmoji(result.recommendation)}{" "}
          {recommendationLabel(result.recommendation)}
        </Badge>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Est. annual value" value={formatCadRange(result.value.annualTimeValueLow, result.value.annualTimeValueHigh)} />
        <Metric label="Feasibility" value={`${result.feasibilityScore}/100`} />
        <Metric label="First-year ROI" value={`${result.roi.firstYearRoiLow}–${result.roi.firstYearRoiHigh}%`} />
        <Metric label="Risk" value={result.governanceRisk} />
      </div>

      {result.secondaryValueFlags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {result.secondaryValueFlags.map((f) => (
            <Badge key={f} variant="info">
              {f}
            </Badge>
          ))}
        </div>
      )}

      {result.governanceCapApplied && (
        <p className="mt-3 text-sm text-amber-700">
          Governance risk cap applied, high ROI alone does not override elevated risk.
        </p>
      )}

      <ExplainabilityPanel result={result} />
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 font-medium text-slate-900">{value}</p>
    </div>
  );
}
