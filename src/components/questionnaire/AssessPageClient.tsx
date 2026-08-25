"use client";

import { useRouter } from "next/navigation";
import { QuestionnaireWizard } from "@/components/questionnaire/QuestionnaireWizard";
import { useAssessmentStore } from "@/store/assessment-store";
import { runAssessment } from "@/engine/scorer";

export function AssessPageClient() {
  const router = useRouter();
  const { profile, step, totalSteps } = useAssessmentStore();

  const handleComplete = () => {
    runAssessment(profile);
    router.push("/results");
  };

  return (
    <QuestionnaireWizard
      onComplete={handleComplete}
      step={step}
      totalSteps={totalSteps()}
    />
  );
}
