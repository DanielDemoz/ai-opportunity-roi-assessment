import type { OpportunityResult, RoadmapPhase } from "@/lib/schemas";

export function buildRoadmap(opportunities: OpportunityResult[]): RoadmapPhase[] {
  const eligible = opportunities.filter(
    (o) =>
      o.recommendation === "priority_opportunity" ||
      o.recommendation === "pilot",
  );

  const quickWins = eligible
    .filter((o) => o.quadrant === "quick_win")
    .sort((a, b) => b.compositeScore - a.compositeScore);

  const strategic = eligible
    .filter((o) => o.quadrant === "strategic")
    .sort((a, b) => b.compositeScore - a.compositeScore);

  const phases: RoadmapPhase[] = [];
  let phaseNum = 1;

  for (const opp of quickWins.slice(0, 1)) {
    phases.push({
      phase: phaseNum++,
      title: `Quick Win — ${opp.opportunity.name}`,
      opportunityId: opp.opportunity.id,
      timeWeeks: { low: 2, high: 4 },
      expectedValue:
        opp.value.annualTimeValueHigh > 15000 ? "Medium–High" : "Medium",
      risk: opp.governanceRisk,
    });
  }

  for (const opp of [...quickWins.slice(1), ...strategic].slice(0, 2)) {
    phases.push({
      phase: phaseNum++,
      title: `Pilot — ${opp.opportunity.name}`,
      opportunityId: opp.opportunity.id,
      timeWeeks: { low: 4, high: 8 },
      expectedValue: opp.value.annualTimeValueHigh > 20000 ? "High" : "Medium–High",
      risk: opp.governanceRisk,
    });
  }

  for (const opp of strategic.slice(0, 1)) {
    if (!phases.some((p) => p.opportunityId === opp.opportunity.id)) {
      phases.push({
        phase: phaseNum++,
        title: `Strategic — ${opp.opportunity.name}`,
        opportunityId: opp.opportunity.id,
        timeWeeks: { low: 8, high: 16 },
        expectedValue: "High",
        risk: opp.governanceRisk,
      });
    }
  }

  return phases.slice(0, 3);
}
