"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AssessmentProfile,
  OpportunityProcessInput,
  QuestionnaireStep,
} from "@/lib/schemas";
import { QUESTIONNAIRE_STEPS } from "@/lib/schemas";
import { getTopMatchedForDeepDive } from "@/engine/matching";

const defaultProfile: AssessmentProfile = {
  employeeCount: "6_20",
  industry: "professional_services",
  primaryGoal: "save_time",
  timeSpentAreas: [],
  topFrustrations: [],
  repetitiveLevel: "moderate",
  repetitiveTasks: [],
  hourlyCost: "dont_know",
  processInputs: [],
  dataQuality: "not_sure",
  processStandardization: "not_sure",
  technicalCapacity: "limited",
  employeeReadiness: "neutral",
  sensitiveData: [],
  decisionAuthority: "informational_only",
};

type AssessmentState = {
  step: number;
  profile: AssessmentProfile;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (partial: Partial<AssessmentProfile>) => void;
  toggleArrayItem: <K extends keyof AssessmentProfile>(
    key: K,
    item: string,
    max?: number,
  ) => void;
  setProcessInput: (input: OpportunityProcessInput) => void;
  loadProfile: (profile: AssessmentProfile) => void;
  loadScenario: (profile: AssessmentProfile) => void;
  reset: () => void;
  currentStepId: () => QuestionnaireStep;
  totalSteps: () => number;
  syncProcessInputsForMatching: () => void;
};

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      step: 0,
      profile: { ...defaultProfile },

      setStep: (step) => set({ step }),

      nextStep: () => {
        const { step, profile } = get();
        if (QUESTIONNAIRE_STEPS[step] === "repetitive_work") {
          get().syncProcessInputsForMatching();
        }
        if (step < QUESTIONNAIRE_STEPS.length - 1) {
          set({ step: step + 1 });
        }
      },

      prevStep: () => {
        const { step } = get();
        if (step > 0) set({ step: step - 1 });
      },

      updateProfile: (partial) =>
        set((s) => ({ profile: { ...s.profile, ...partial } })),

      toggleArrayItem: (key, item, max) =>
        set((s) => {
          const arr = (s.profile[key] as string[]) ?? [];
          const exists = arr.includes(item);
          let next: string[];
          if (exists) {
            next = arr.filter((i) => i !== item);
          } else if (max && arr.length >= max) {
            next = [...arr.slice(1), item];
          } else {
            next = [...arr, item];
          }
          return { profile: { ...s.profile, [key]: next } };
        }),

      setProcessInput: (input) =>
        set((s) => {
          const existing = s.profile.processInputs.filter(
            (p) => p.opportunityId !== input.opportunityId,
          );
          return {
            profile: {
              ...s.profile,
              processInputs: [...existing, input],
            },
          };
        }),

      loadProfile: (profile) => set({ profile, step: 0 }),
      loadScenario: (profile) => set({ profile, step: 0 }),

      reset: () => set({ step: 0, profile: { ...defaultProfile } }),

      currentStepId: () => QUESTIONNAIRE_STEPS[get().step],

      totalSteps: () => QUESTIONNAIRE_STEPS.length,

      syncProcessInputsForMatching: () => {
        const { profile } = get();
        const topIds = getTopMatchedForDeepDive(profile);
        const defaults: OpportunityProcessInput = {
          opportunityId: "",
          processMethod: "completely_manual",
          frequency: "weekly",
          duration: "30_60_min",
          employeesInvolved: "2_5",
        };
        const existing = profile.processInputs.filter((p) =>
          topIds.includes(p.opportunityId),
        );
        const missing = topIds.filter(
          (id) => !existing.some((p) => p.opportunityId === id),
        );
        const newInputs = missing.map((id) => ({
          ...defaults,
          opportunityId: id,
        }));
        if (newInputs.length > 0) {
          set({
            profile: {
              ...profile,
              processInputs: [...existing, ...newInputs],
            },
          });
        }
      },
    }),
    {
      name: "ai-opportunity-assessment",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ step: s.step, profile: s.profile }),
    },
  ),
);
