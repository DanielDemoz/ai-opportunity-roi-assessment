"use client";

import type { AssessmentResult } from "@/lib/schemas";
import { BRUKD_URL } from "@/lib/constants";
import { brukdReasonLabel } from "@/engine/brukd-cta";
import type { BrukdCtaReason } from "@/engine/brukd-cta";
import { Card, SectionTitle } from "@/components/ui/primitives";
import { OpportunityCard } from "@/components/results/ExplainabilityPanel";
import { ValueComplexityMatrix, RiskValueMatrix } from "@/components/results/MatrixCharts";
import { formatCadRange, formatPercentRange } from "@/lib/utils";
import { recommendationEmoji, recommendationLabel } from "@/engine/recommendations";
import {
  buildShareUrl,
  downloadTextFile,
  formatResultsAsReport,
} from "@/lib/share-export";

type Props = {
  result: AssessmentResult;
};

export function ResultsView({ result }: Props) {
  const handleDownload = () => {
    downloadTextFile(formatResultsAsReport(result), "ai-opportunity-assessment.txt");
  };

  const handleShare = () => {
    const url = buildShareUrl(result.profile);
    navigator.clipboard?.writeText(url);
  };

  return (
    <div className="results-page space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Your AI Opportunity Assessment
        </h1>
        <p className="mt-2 text-slate-600">
          Scenario-based estimates under the assumptions shown below — not guaranteed
          savings.
        </p>
      </div>

      {result.improveProcessFirst && (
        <Card className="border-amber-200 bg-amber-50">
          <h2 className="text-lg font-semibold text-amber-900">
            Recommendation: Improve the process before investing in AI
          </h2>
          <p className="mt-2 text-sm text-amber-800">
            Your processes appear inconsistent or data quality is insufficient for
            reliable AI outcomes. Standardizing workflows and improving data quality
            may deliver value before AI investment.
          </p>
        </Card>
      )}

      {result.aiNotRecommended && (
        <Card className="border-red-200 bg-red-50">
          <h2 className="text-lg font-semibold text-red-900">
            AI is not recommended for the identified problems at this time
          </h2>
          <p className="mt-2 text-sm text-red-800">
            Based on your inputs, the expected value, feasibility, or risk profile
            does not support AI investment right now. This is a valid and useful
            outcome.
          </p>
        </Card>
      )}

      <Card>
        <SectionTitle title="Overall AI Opportunity" />
        <p className="text-2xl font-bold text-slate-900">{result.overallOpportunityLevel}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryMetric
            label="Estimated opportunity value"
            value={`${formatCadRange(result.totalValueLow, result.totalValueHigh)} / year`}
          />
          <SummaryMetric
            label="Estimated first-year investment"
            value={formatCadRange(result.totalFirstYearCostLow, result.totalFirstYearCostHigh)}
          />
          <SummaryMetric
            label="Estimated first-year ROI"
            value={formatPercentRange(result.portfolioRoiLow, result.portfolioRoiHigh)}
          />
          <SummaryMetric
            label="Confidence"
            value={result.overallConfidence.charAt(0).toUpperCase() + result.overallConfidence.slice(1)}
          />
        </div>
      </Card>

      <div>
        <SectionTitle
          title="Top Opportunities"
          subtitle="Ranked by composite score with governance caps applied."
        />
        <div className="space-y-4">
          {result.opportunities.slice(0, 5).map((o) => (
            <OpportunityCard key={o.opportunity.id} result={o} />
          ))}
        </div>
      </div>

      <Card>
        <SectionTitle title="AI Opportunity Portfolio" />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-2 pr-4 font-medium">Opportunity</th>
                <th className="pb-2 pr-4 font-medium">Value</th>
                <th className="pb-2 pr-4 font-medium">Feasibility</th>
                <th className="pb-2 pr-4 font-medium">ROI</th>
                <th className="pb-2 pr-4 font-medium">Risk</th>
                <th className="pb-2 font-medium">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {result.opportunities.map((o) => (
                <tr key={o.opportunity.id} className="border-b border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-900">
                    {o.opportunity.name}
                  </td>
                  <td className="py-3 pr-4">
                    {formatCadRange(o.value.annualTimeValueLow, o.value.annualTimeValueHigh)}
                  </td>
                  <td className="py-3 pr-4">{o.feasibilityScore}/100</td>
                  <td className="py-3 pr-4">
                    {o.roi.firstYearRoiLow}–{o.roi.firstYearRoiHigh}%
                  </td>
                  <td className="py-3 pr-4">{o.governanceRisk}</td>
                  <td className="py-3">
                    {recommendationEmoji(o.recommendation)}{" "}
                    {recommendationLabel(o.recommendation)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <ValueComplexityMatrix opportunities={result.opportunities} />
        <RiskValueMatrix opportunities={result.opportunities} />
      </div>

      {result.roadmap.length > 0 && (
        <Card>
          <SectionTitle title="Recommended Implementation Roadmap" />
          <div className="space-y-4">
            {result.roadmap.map((phase) => (
              <div
                key={phase.phase}
                className="rounded-lg border border-slate-100 p-4"
              >
                <p className="text-sm font-medium text-slate-500">Phase {phase.phase}</p>
                <h3 className="mt-1 font-semibold text-slate-900">{phase.title}</h3>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span>
                    Time: {phase.timeWeeks.low}–{phase.timeWeeks.high} weeks
                  </span>
                  <span>Expected value: {phase.expectedValue}</span>
                  <span>Risk: {phase.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {Object.keys(result.pilots).length > 0 && (
        <Card>
          <SectionTitle title="Pilot Recommendations" />
          <div className="space-y-6">
            {Object.entries(result.pilots).map(([id, pilot]) => {
              const opp = result.opportunities.find((o) => o.opportunity.id === id);
              return (
                <div key={id} className="rounded-lg border border-slate-100 p-4">
                  <h3 className="font-semibold text-slate-900">
                    {opp?.opportunity.name ?? id}
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div>
                      <dt className="font-medium text-slate-700">Pilot objective</dt>
                      <dd className="text-slate-600">{pilot.objective}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-700">Baseline</dt>
                      <dd className="text-slate-600">{pilot.baseline}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-700">Success metrics</dt>
                      <dd className="text-slate-600">{pilot.successMetrics.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-700">Duration</dt>
                      <dd className="text-slate-600">
                        {pilot.durationWeeks.low}–{pilot.durationWeeks.high} weeks
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-slate-700">Go / No-Go criteria</dt>
                      <dd className="text-slate-600">{pilot.goNoGo}</dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {result.brukdCta.show && (
        <Card className="border-slate-300 bg-slate-50">
          <SectionTitle title="This Opportunity May Need a Customized Assessment" />
          <p className="text-sm text-slate-700">
            The opportunity may justify a more detailed technical, business, or
            governance assessment before investment.
          </p>
          <ul className="mt-3 list-inside list-disc text-sm text-slate-600">
            {result.brukdCta.reasons.map((r) => (
              <li key={r}>{brukdReasonLabel(r as BrukdCtaReason)}</li>
            ))}
          </ul>
          <a
            href={BRUKD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
          >
            Talk to BRUKD Consultancy
          </a>
        </Card>
      )}

      <Card>
        <SectionTitle title="Assumptions & Disclaimer" />
        <ul className="list-inside list-disc space-y-2 text-sm text-slate-600">
          <li>
            <strong>Evidence</strong> — efficiency ranges sourced from industry
            benchmarks where available.
          </li>
          <li>
            <strong>User input</strong> — time, frequency, and employee counts from
            your answers.
          </li>
          <li>
            <strong>Assumption</strong> — cost bands and default hourly rate where you
            selected &quot;I don&apos;t know&quot;.
          </li>
          <li>
            All ROI figures are scenario-based estimates, not financial forecasts or
            guaranteed savings.
          </li>
          <li>This tool does not provide legal or compliance advice.</li>
        </ul>
      </Card>

      <div className="no-print flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Download Report
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Copy Share Link
        </button>
        <a
          href="/assess"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
        >
          Start New Assessment
        </a>
      </div>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
