"use client";

import { useEffect } from "react";
import {
  Card,
  FieldLabel,
  OptionGrid,
  ProgressBar,
  RadioGroup,
  SectionTitle,
} from "@/components/ui/primitives";
import { getOpportunityById } from "@/data/opportunities/catalog";
import { getTopMatchedForDeepDive } from "@/engine/matching";
import {
  DATA_QUALITY_OPTIONS,
  DECISION_AUTHORITY_OPTIONS,
  DURATION_OPTIONS,
  EMPLOYEE_COUNT_OPTIONS,
  EMPLOYEES_INVOLVED_OPTIONS,
  EMPLOYEE_READINESS_OPTIONS,
  FREQUENCY_OPTIONS,
  FRUSTRATION_OPTIONS,
  GOAL_OPTIONS,
  HOURLY_COST_OPTIONS,
  INDUSTRY_OPTIONS,
  PROCESS_METHOD_OPTIONS,
  PROCESS_STANDARDIZATION_OPTIONS,
  REPETITIVE_LEVEL_OPTIONS,
  REPETITIVE_TASK_OPTIONS,
  SENSITIVE_DATA_OPTIONS,
  STEP_TITLES,
  TECHNICAL_CAPACITY_OPTIONS,
  TIME_SPENT_OPTIONS,
} from "@/lib/questionnaire-options";
import type { AssessmentProfile } from "@/lib/schemas";
import { useAssessmentStore } from "@/store/assessment-store";
import { DEMO_SCENARIOS } from "@/data/scenarios/index";

type Props = {
  onComplete: () => void;
  step: number;
  totalSteps: number;
};

export function QuestionnaireWizard({ onComplete, step, totalSteps }: Props) {
  const {
    profile,
    currentStepId,
    nextStep,
    prevStep,
    updateProfile,
    toggleArrayItem,
    setProcessInput,
    loadScenario,
    syncProcessInputsForMatching,
  } = useAssessmentStore();

  const stepId = currentStepId();
  const stepMeta = STEP_TITLES[stepId];

  useEffect(() => {
    if (stepId === "process_details") {
      syncProcessInputsForMatching();
    }
  }, [stepId, syncProcessInputsForMatching]);

  const topOpportunityIds = getTopMatchedForDeepDive(profile);

  const canProceed = (): boolean => {
    switch (stepId) {
      case "business_profile":
        return !!profile.employeeCount && !!profile.industry && !!profile.primaryGoal;
      case "pain_points":
        return profile.timeSpentAreas.length >= 1;
      case "repetitive_work":
        return profile.repetitiveTasks.length >= 1 && !!profile.repetitiveLevel;
      case "process_details":
        return topOpportunityIds.every((id) =>
          profile.processInputs.some((p) => p.opportunityId === id),
        );
      case "employee_cost":
        return !!profile.hourlyCost;
      case "feasibility_inputs":
        return (
          !!profile.dataQuality &&
          !!profile.processStandardization &&
          !!profile.technicalCapacity &&
          !!profile.employeeReadiness
        );
      case "risk_governance":
        return !!profile.decisionAuthority;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step === totalSteps - 1) {
      onComplete();
    } else {
      nextStep();
    }
  };

  const toggleSensitive = (id: string) => {
    type Sensitive = AssessmentProfile["sensitiveData"][number];
    const sid = id as Sensitive;
    if (sid === "none") {
      updateProfile({ sensitiveData: ["none"] });
      return;
    }
    const current = profile.sensitiveData.filter((s) => s !== "none") as Sensitive[];
    if (current.includes(sid)) {
      updateProfile({
        sensitiveData: current.filter((s) => s !== sid),
      });
    } else {
      updateProfile({
        sensitiveData: [...current, sid],
      });
    }
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={step} total={totalSteps} />

      <Card>
        <SectionTitle title={stepMeta.title} subtitle={stepMeta.subtitle} />

        {stepId === "business_profile" && (
          <div className="space-y-8">
            <div>
              <FieldLabel>How many employees does your business have?</FieldLabel>
              <RadioGroup
                name="employeeCount"
                options={EMPLOYEE_COUNT_OPTIONS}
                value={profile.employeeCount}
                onChange={(v) =>
                  updateProfile({ employeeCount: v as typeof profile.employeeCount })
                }
              />
            </div>
            <div>
              <FieldLabel>What industry are you in?</FieldLabel>
              <RadioGroup
                name="industry"
                options={INDUSTRY_OPTIONS}
                value={profile.industry}
                onChange={(v) => updateProfile({ industry: v as typeof profile.industry })}
              />
            </div>
            <div>
              <FieldLabel>What is your primary business goal right now?</FieldLabel>
              <RadioGroup
                name="primaryGoal"
                options={GOAL_OPTIONS}
                value={profile.primaryGoal}
                onChange={(v) =>
                  updateProfile({ primaryGoal: v as typeof profile.primaryGoal })
                }
              />
            </div>
          </div>
        )}

        {stepId === "pain_points" && (
          <div className="space-y-8">
            <div>
              <FieldLabel>Where does your business currently spend too much time?</FieldLabel>
              <OptionGrid
                options={TIME_SPENT_OPTIONS}
                selected={profile.timeSpentAreas}
                onToggle={(id) => toggleArrayItem("timeSpentAreas", id)}
              />
            </div>
            <div>
              <FieldLabel>Which problems are most frustrating? (Select up to 3)</FieldLabel>
              <OptionGrid
                options={FRUSTRATION_OPTIONS}
                selected={profile.topFrustrations}
                onToggle={(id) => toggleArrayItem("topFrustrations", id, 3)}
              />
            </div>
          </div>
        )}

        {stepId === "repetitive_work" && (
          <div className="space-y-8">
            <div>
              <FieldLabel>
                How much of your employees&apos; time is spent on repetitive tasks?
              </FieldLabel>
              <RadioGroup
                name="repetitiveLevel"
                options={REPETITIVE_LEVEL_OPTIONS}
                value={profile.repetitiveLevel}
                onChange={(v) =>
                  updateProfile({ repetitiveLevel: v as typeof profile.repetitiveLevel })
                }
              />
            </div>
            <div>
              <FieldLabel>Which repetitive tasks are most common?</FieldLabel>
              <OptionGrid
                options={REPETITIVE_TASK_OPTIONS}
                selected={profile.repetitiveTasks}
                onToggle={(id) => toggleArrayItem("repetitiveTasks", id)}
              />
            </div>
          </div>
        )}

        {stepId === "process_details" && (
          <div className="space-y-10">
            <p className="text-sm text-slate-600">
              Based on your answers, we identified these top opportunities. Tell us how
              each task is currently performed.
            </p>
            {topOpportunityIds.map((oppId) => {
              const opp = getOpportunityById(oppId);
              const input = profile.processInputs.find((p) => p.opportunityId === oppId);
              if (!opp || !input) return null;
              return (
                <div key={oppId} className="rounded-lg border border-slate-100 p-4">
                  <h3 className="mb-4 font-medium text-slate-900">{opp.name}</h3>
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>How is this task currently performed?</FieldLabel>
                      <RadioGroup
                        name={`method-${oppId}`}
                        options={PROCESS_METHOD_OPTIONS}
                        value={input.processMethod}
                        onChange={(v) =>
                          setProcessInput({
                            ...input,
                            processMethod: v as typeof input.processMethod,
                          })
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>How often does it happen?</FieldLabel>
                      <RadioGroup
                        name={`freq-${oppId}`}
                        options={FREQUENCY_OPTIONS}
                        value={input.frequency}
                        onChange={(v) =>
                          setProcessInput({
                            ...input,
                            frequency: v as typeof input.frequency,
                          })
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>Approximately how much time does it take?</FieldLabel>
                      <RadioGroup
                        name={`dur-${oppId}`}
                        options={DURATION_OPTIONS}
                        value={input.duration}
                        onChange={(v) =>
                          setProcessInput({
                            ...input,
                            duration: v as typeof input.duration,
                          })
                        }
                      />
                    </div>
                    <div>
                      <FieldLabel>How many employees are involved?</FieldLabel>
                      <RadioGroup
                        name={`emp-${oppId}`}
                        options={EMPLOYEES_INVOLVED_OPTIONS}
                        value={input.employeesInvolved}
                        onChange={(v) =>
                          setProcessInput({
                            ...input,
                            employeesInvolved: v as typeof input.employeesInvolved,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {stepId === "employee_cost" && (
          <div>
            <FieldLabel>Approximate hourly employee cost (including benefits)</FieldLabel>
            <RadioGroup
              name="hourlyCost"
              options={HOURLY_COST_OPTIONS}
              value={profile.hourlyCost}
              onChange={(v) =>
                updateProfile({ hourlyCost: v as typeof profile.hourlyCost })
              }
            />
            {profile.hourlyCost === "dont_know" && (
              <p className="mt-3 text-sm text-amber-700">
                We will use a clearly labeled default assumption ($32/hour CAD) for
                estimates.
              </p>
            )}
          </div>
        )}

        {stepId === "feasibility_inputs" && (
          <div className="space-y-8">
            <div>
              <FieldLabel>How would you describe your data quality?</FieldLabel>
              <RadioGroup
                name="dataQuality"
                options={DATA_QUALITY_OPTIONS}
                value={profile.dataQuality}
                onChange={(v) =>
                  updateProfile({ dataQuality: v as typeof profile.dataQuality })
                }
              />
            </div>
            <div>
              <FieldLabel>How standardized are your key business processes?</FieldLabel>
              <RadioGroup
                name="processStandardization"
                options={PROCESS_STANDARDIZATION_OPTIONS}
                value={profile.processStandardization}
                onChange={(v) =>
                  updateProfile({
                    processStandardization: v as typeof profile.processStandardization,
                  })
                }
              />
            </div>
            <div>
              <FieldLabel>What technical capacity do you have?</FieldLabel>
              <RadioGroup
                name="technicalCapacity"
                options={TECHNICAL_CAPACITY_OPTIONS}
                value={profile.technicalCapacity}
                onChange={(v) =>
                  updateProfile({
                    technicalCapacity: v as typeof profile.technicalCapacity,
                  })
                }
              />
            </div>
            <div>
              <FieldLabel>How ready are employees to adopt new tools?</FieldLabel>
              <RadioGroup
                name="employeeReadiness"
                options={EMPLOYEE_READINESS_OPTIONS}
                value={profile.employeeReadiness}
                onChange={(v) =>
                  updateProfile({
                    employeeReadiness: v as typeof profile.employeeReadiness,
                  })
                }
              />
            </div>
          </div>
        )}

        {stepId === "risk_governance" && (
          <div className="space-y-8">
            <div>
              <FieldLabel>What types of sensitive data might be involved?</FieldLabel>
              <OptionGrid
                options={SENSITIVE_DATA_OPTIONS}
                selected={profile.sensitiveData}
                onToggle={toggleSensitive}
              />
            </div>
            <div>
              <FieldLabel>What level of AI decision-making authority are you considering?</FieldLabel>
              <RadioGroup
                name="decisionAuthority"
                options={DECISION_AUTHORITY_OPTIONS}
                value={profile.decisionAuthority}
                onChange={(v) =>
                  updateProfile({
                    decisionAuthority: v as typeof profile.decisionAuthority,
                  })
                }
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 0}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="rounded-lg bg-slate-800 px-6 py-2 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-40"
          >
            {step === totalSteps - 1 ? "View Results" : "Continue"}
          </button>
        </div>
      </Card>

      {step === 0 && (
        <Card className="no-print">
          <SectionTitle
            title="Try a demo scenario"
            subtitle="Load a preset business profile to explore sample results."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {DEMO_SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => loadScenario(s.profile)}
                className="rounded-lg border border-slate-200 px-4 py-3 text-left text-sm hover:border-slate-400 hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">{s.name}</span>
                <p className="mt-1 text-slate-600">{s.description}</p>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
