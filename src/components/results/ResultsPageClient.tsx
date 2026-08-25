"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ResultsView } from "@/components/results/ResultsView";
import { runAssessment } from "@/engine/scorer";
import { decodeProfileFromShare, getShareParamName } from "@/lib/share-export";
import { useAssessmentStore } from "@/store/assessment-store";

export function ResultsPageClient() {
  const searchParams = useSearchParams();
  const { profile } = useAssessmentStore();

  const result = useMemo(() => {
    const shareParam = searchParams.get(getShareParamName());
    if (shareParam) {
      const shared = decodeProfileFromShare(shareParam);
      if (shared) return runAssessment(shared);
    }
    return runAssessment(profile);
  }, [profile, searchParams]);

  if (result.opportunities.length === 0 && profile.timeSpentAreas.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900">No assessment data</h1>
        <p className="mt-2 text-slate-600">
          Complete the assessment first to see your results.
        </p>
        <a
          href="/assess"
          className="mt-4 inline-block rounded-lg bg-slate-800 px-4 py-2 text-white"
        >
          Start Assessment
        </a>
      </div>
    );
  }

  return <ResultsView result={result} />;
}
