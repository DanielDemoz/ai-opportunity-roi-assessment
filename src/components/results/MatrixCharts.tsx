"use client";

import type { OpportunityResult } from "@/lib/schemas";
import { COMPLEXITY_TO_SCORE } from "@/data/assumptions/enum-conversions";

const QUADRANT_LABELS = {
  quick_win: "Quick Wins",
  strategic: "Strategic Projects",
  opportunistic: "Opportunistic",
  defer: "Avoid / Defer",
} as const;

export function ValueComplexityMatrix({
  opportunities,
}: {
  opportunities: OpportunityResult[];
}) {
  return (
    <MatrixChart
      title="Value vs. Complexity Matrix"
      xLabel="Implementation Complexity →"
      yLabel="Potential Business Value →"
      opportunities={opportunities}
      getX={(o) => COMPLEXITY_TO_SCORE[o.opportunity.implementation_complexity]}
      getY={(o) => {
        const mid = (o.value.annualTimeValueLow + o.value.annualTimeValueHigh) / 2;
        if (mid >= 25000) return 85;
        if (mid >= 10000) return 65;
        if (mid >= 5000) return 45;
        return 25;
      }}
      getQuadrant={(o) => QUADRANT_LABELS[o.quadrant]}
    />
  );
}

export function RiskValueMatrix({
  opportunities,
}: {
  opportunities: OpportunityResult[];
}) {
  return (
    <MatrixChart
      title="Risk vs. Value Matrix"
      xLabel="Risk →"
      yLabel="Business Value →"
      opportunities={opportunities}
      getX={(o) => {
        const map = { Low: 20, Moderate: 45, High: 70, "Very High": 90 };
        return map[o.governanceRisk];
      }}
      getY={(o) => {
        const mid = (o.value.annualTimeValueLow + o.value.annualTimeValueHigh) / 2;
        if (mid >= 25000) return 85;
        if (mid >= 10000) return 65;
        if (mid >= 5000) return 45;
        return 25;
      }}
      getQuadrant={(o) => {
        if (o.riskQuadrant === "high_value_high_risk") {
          return "Requires governance review";
        }
        return o.riskQuadrant.replace(/_/g, " ");
      }}
    />
  );
}

function MatrixChart({
  title,
  xLabel,
  yLabel,
  opportunities,
  getX,
  getY,
  getQuadrant,
}: {
  title: string;
  xLabel: string;
  yLabel: string;
  opportunities: OpportunityResult[];
  getX: (o: OpportunityResult) => number;
  getY: (o: OpportunityResult) => number;
  getQuadrant: (o: OpportunityResult) => string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <div className="relative mt-6 aspect-square max-h-80 w-full border border-slate-200 bg-slate-50">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="border-b border-r border-slate-200 bg-emerald-50/50" />
          <div className="border-b border-slate-200 bg-blue-50/50" />
          <div className="border-r border-slate-200 bg-amber-50/50" />
          <div className="bg-red-50/50" />
        </div>
        {opportunities.slice(0, 7).map((o) => (
          <div
            key={o.opportunity.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${getX(o)}%`, top: `${100 - getY(o)}%` }}
            title={`${o.opportunity.name}: ${getQuadrant(o)}`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white shadow">
              {o.opportunity.name.charAt(0)}
            </div>
          </div>
        ))}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-slate-500">
          {xLabel}
        </div>
        <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-slate-500">
          {yLabel}
        </div>
      </div>
      <ul className="mt-4 space-y-1 text-sm text-slate-600">
        {opportunities.slice(0, 5).map((o) => (
          <li key={o.opportunity.id}>
            <span className="font-medium text-slate-800">{o.opportunity.name}</span>
            {": "}
            {getQuadrant(o)}
          </li>
        ))}
      </ul>
    </div>
  );
}
