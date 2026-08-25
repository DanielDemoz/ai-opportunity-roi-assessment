import type { AssessmentProfile, Opportunity } from "@/lib/schemas";
import { OPPORTUNITY_CATALOG } from "@/data/opportunities/catalog";
import { MAX_MATCHED_OPPORTUNITIES } from "@/lib/constants";

const INDUSTRY_BOOST_MAX = 0.1;

export type MatchResult = {
  opportunity: Opportunity;
  matchScore: number;
  matchReasons: string[];
};

function tagOverlap(userTags: string[], oppTags: string[]): number {
  if (oppTags.length === 0) return 0;
  const overlap = userTags.filter((t) => oppTags.includes(t)).length;
  return overlap / oppTags.length;
}

export function buildUserTags(profile: AssessmentProfile): {
  painPoints: string[];
  repetitive: string[];
  frustrations: string[];
} {
  return {
    painPoints: profile.timeSpentAreas,
    repetitive: profile.repetitiveTasks,
    frustrations: profile.topFrustrations,
  };
}

export function matchOpportunities(profile: AssessmentProfile): MatchResult[] {
  const { painPoints, repetitive, frustrations } = buildUserTags(profile);

  const results: MatchResult[] = [];

  for (const opportunity of OPPORTUNITY_CATALOG) {
    if (opportunity.high_risk) {
      const explicitlyRelated =
        painPoints.includes("employee_onboarding") &&
        frustrations.includes("repetitive_work") &&
        profile.repetitiveTasks.includes("reviewing_forms");
      if (!explicitlyRelated) continue;
    }

    const painScore = tagOverlap(painPoints, opportunity.pain_point_tags);
    const repScore = tagOverlap(repetitive, opportunity.repetitive_task_tags);
    const frustScore = tagOverlap(frustrations, opportunity.frustration_tags);

    let score = painScore * 0.5 + repScore * 0.35 + frustScore * 0.15;

    const reasons: string[] = [];
    if (painScore > 0) reasons.push("Matches reported time-spent areas");
    if (repScore > 0) reasons.push("Matches repetitive task patterns");
    if (frustScore > 0) reasons.push("Addresses top frustrations");

    if (opportunity.industry_hints.includes(profile.industry)) {
      score += INDUSTRY_BOOST_MAX;
      reasons.push("Industry pattern hint (not determinative)");
    }

    if (profile.repetitiveLevel === "significant" || profile.repetitiveLevel === "large_portion") {
      if (opportunity.typical_value_drivers.includes("Time savings")) {
        score += 0.05;
      }
    }

    if (score > 0.1) {
      results.push({
        opportunity,
        matchScore: Math.min(1, score),
        matchReasons: reasons,
      });
    }
  }

  return results
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, MAX_MATCHED_OPPORTUNITIES);
}

export function getTopMatchedForDeepDive(
  profile: AssessmentProfile,
): string[] {
  return matchOpportunities(profile)
    .slice(0, 3)
    .map((m) => m.opportunity.id);
}
