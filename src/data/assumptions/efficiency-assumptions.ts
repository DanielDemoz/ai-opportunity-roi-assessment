import type { EfficiencyAssumptionSchema } from "@/lib/schemas";
import type { z } from "zod";

export type EfficiencyAssumption = z.infer<typeof EfficiencyAssumptionSchema>;

export const EFFICIENCY_ASSUMPTIONS: Record<string, EfficiencyAssumption> = {
  "efficiency-email-assistant": {
    id: "efficiency-email-assistant",
    range: { low: 0.2, high: 0.4 },
    confidence: "moderate",
    source: "Industry benchmark / expert estimate",
    date: "2026-01",
    notes: "Assumes human review remains in loop for customer-facing email",
  },
  "efficiency-doc-extraction": {
    id: "efficiency-doc-extraction",
    range: { low: 0.4, high: 0.7 },
    confidence: "moderate",
    source: "Document AI adoption studies (illustrative)",
    date: "2026-01",
    notes: "Depends on document consistency and template quality",
  },
  "efficiency-doc-summarization": {
    id: "efficiency-doc-summarization",
    range: { low: 0.3, high: 0.6 },
    confidence: "moderate",
    source: "Industry benchmark / expert estimate",
    date: "2026-01",
    notes: "Best for structured reports and meeting notes",
  },
  "efficiency-meeting-summary": {
    id: "efficiency-meeting-summary",
    range: { low: 0.5, high: 0.8 },
    confidence: "moderate",
    source: "Industry benchmark / expert estimate",
    date: "2026-01",
    notes: "Requires clear audio or transcript input",
  },
  "efficiency-faq-assistant": {
    id: "efficiency-faq-assistant",
    range: { low: 0.25, high: 0.45 },
    confidence: "moderate",
    source: "Customer service automation benchmarks (illustrative)",
    date: "2026-01",
    notes: "Escalation path for complex inquiries assumed",
  },
  "efficiency-report-generation": {
    id: "efficiency-report-generation",
    range: { low: 0.3, high: 0.55 },
    confidence: "moderate",
    source: "Industry benchmark / expert estimate",
    date: "2026-01",
    notes: "Requires defined report templates",
  },
  "efficiency-data-entry": {
    id: "efficiency-data-entry",
    range: { low: 0.35, high: 0.6 },
    confidence: "moderate",
    source: "RPA/document AI benchmarks (illustrative)",
    date: "2026-01",
    notes: "Standardized forms improve outcomes",
  },
  "efficiency-scheduling": {
    id: "efficiency-scheduling",
    range: { low: 0.2, high: 0.4 },
    confidence: "low",
    source: "Expert estimate, varies widely by business",
    date: "2026-01",
    notes: "Complex scheduling rules reduce achievable savings",
  },
  "efficiency-content-generation": {
    id: "efficiency-content-generation",
    range: { low: 0.25, high: 0.5 },
    confidence: "moderate",
    source: "Marketing AI adoption studies (illustrative)",
    date: "2026-01",
    notes: "Human editorial review recommended",
  },
  "efficiency-invoice-processing": {
    id: "efficiency-invoice-processing",
    range: { low: 0.35, high: 0.65 },
    confidence: "moderate",
    source: "AP automation benchmarks (illustrative)",
    date: "2026-01",
    notes: "Standard invoice formats improve accuracy",
  },
  "efficiency-lead-prioritization": {
    id: "efficiency-lead-prioritization",
    range: { low: 0.15, high: 0.35 },
    confidence: "low",
    source: "Expert estimate, revenue impact highly variable",
    date: "2026-01",
    notes: "Secondary value may include conversion improvement",
  },
  "efficiency-knowledge-assistant": {
    id: "efficiency-knowledge-assistant",
    range: { low: 0.2, high: 0.45 },
    confidence: "moderate",
    source: "Knowledge management AI benchmarks (illustrative)",
    date: "2026-01",
    notes: "Requires curated knowledge base",
  },
  "efficiency-forecasting": {
    id: "efficiency-forecasting",
    range: { low: 0.15, high: 0.3 },
    confidence: "low",
    source: "Expert estimate, data quality dependent",
    date: "2026-01",
    notes: "Process standardization often needed first",
  },
  "efficiency-inquiry-classification": {
    id: "efficiency-inquiry-classification",
    range: { low: 0.3, high: 0.5 },
    confidence: "moderate",
    source: "Customer service automation benchmarks (illustrative)",
    date: "2026-01",
    notes: "Routing accuracy depends on training data",
  },
  "efficiency-onboarding-assistant": {
    id: "efficiency-onboarding-assistant",
    range: { low: 0.2, high: 0.4 },
    confidence: "low",
    source: "Expert estimate",
    date: "2026-01",
    notes: "HR content must be kept current",
  },
  "efficiency-campaign-analysis": {
    id: "efficiency-campaign-analysis",
    range: { low: 0.25, high: 0.45 },
    confidence: "moderate",
    source: "Marketing analytics benchmarks (illustrative)",
    date: "2026-01",
    notes: "Data integration complexity affects feasibility",
  },
  "efficiency-anomaly-detection": {
    id: "efficiency-anomaly-detection",
    range: { low: 0.1, high: 0.25 },
    confidence: "low",
    source: "Expert estimate, risk reduction primary driver",
    date: "2026-01",
    notes: "Value often in error/risk reduction, not time alone",
  },
  "efficiency-demand-forecasting": {
    id: "efficiency-demand-forecasting",
    range: { low: 0.15, high: 0.35 },
    confidence: "low",
    source: "Expert estimate",
    date: "2026-01",
    notes: "Requires historical data and standardized processes",
  },
};

export function getEfficiencyAssumption(id: string): EfficiencyAssumption {
  const assumption = EFFICIENCY_ASSUMPTIONS[id];
  if (!assumption) {
    return {
      id: "default",
      range: { low: 0.1, high: 0.25 },
      confidence: "low",
      source: "Conservative default, no specific evidence",
      date: "2026-01",
      notes: "Used when no opportunity-specific assumption exists",
    };
  }
  return assumption;
}
