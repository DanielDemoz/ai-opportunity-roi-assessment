import { Suspense } from "react";
import { ResultsPageClient } from "@/components/results/ResultsPageClient";

export default function ResultsPage() {
  return (
    <Suspense fallback={<p className="text-slate-600">Loading results…</p>}>
      <ResultsPageClient />
    </Suspense>
  );
}
