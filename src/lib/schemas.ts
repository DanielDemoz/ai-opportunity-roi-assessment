import { z } from "zod";

export const EmployeeCountSchema = z.enum([
  "1_5",
  "6_20",
  "21_50",
  "51_100",
  "101_250",
  "250_plus",
]);

export const IndustrySchema = z.enum([
  "professional_services",
  "retail",
  "healthcare",
  "education",
  "construction_trades",
  "finance_accounting",
  "marketing_creative",
  "technology",
  "manufacturing",
  "hospitality",
  "transportation_logistics",
  "non_profit",
  "other",
]);

export const BusinessGoalSchema = z.enum([
  "reduce_costs",
  "save_time",
  "increase_revenue",
  "improve_customer_service",
  "improve_quality",
  "reduce_errors",
  "scale_operations",
  "improve_decision_making",
  "improve_productivity",
  "other",
]);

export const TimeSpentAreaSchema = z.enum([
  "email",
  "administrative",
  "data_entry",
  "customer_inquiries",
  "scheduling",
  "document_processing",
  "reporting",
  "marketing",
  "sales_follow_up",
  "bookkeeping",
  "research",
  "employee_onboarding",
  "customer_support",
  "inventory_management",
  "data_analysis",
  "other",
]);

export const FrustrationSchema = z.enum([
  "repetitive_work",
  "searching_information",
  "slow_customer_response",
  "manual_document_processing",
  "too_many_errors",
  "too_much_reporting",
  "difficult_scheduling",
  "difficult_forecasting",
  "too_much_admin",
  "difficulty_scaling",
  "missed_sales",
  "high_operating_costs",
]);

export const RepetitiveLevelSchema = z.enum([
  "very_little",
  "some",
  "moderate",
  "significant",
  "large_portion",
]);

export const RepetitiveTaskSchema = z.enum([
  "copying_between_systems",
  "reading_documents",
  "writing_emails",
  "creating_reports",
  "answering_similar_questions",
  "scheduling",
  "data_entry",
  "data_cleaning",
  "creating_summaries",
  "reviewing_forms",
  "customer_follow_up",
  "other",
]);

export const ProcessMethodSchema = z.enum([
  "completely_manual",
  "spreadsheet",
  "existing_software",
  "rule_based_automation",
  "ai_assisted",
  "fully_automated",
  "not_sure",
]);

export const FrequencySchema = z.enum([
  "several_per_day",
  "daily",
  "several_per_week",
  "weekly",
  "monthly",
  "occasionally",
]);

export const DurationSchema = z.enum([
  "under_15_min",
  "15_30_min",
  "30_60_min",
  "1_2_hours",
  "2_4_hours",
  "over_4_hours",
]);

export const EmployeesInvolvedSchema = z.enum([
  "1",
  "2_5",
  "6_10",
  "10_plus",
]);

export const HourlyCostSchema = z.enum([
  "under_20",
  "20_30",
  "30_40",
  "40_60",
  "60_80",
  "80_plus",
  "dont_know",
]);

export const DataQualitySchema = z.enum(["poor", "mixed", "good", "not_sure"]);
export const ProcessStandardizationSchema = z.enum([
  "inconsistent",
  "somewhat_standard",
  "well_defined",
  "not_sure",
]);

export const TechnicalCapacitySchema = z.enum([
  "none",
  "limited",
  "some",
  "strong",
]);

export const EmployeeReadinessSchema = z.enum([
  "resistant",
  "neutral",
  "open",
  "eager",
]);

export const SensitiveDataSchema = z.enum([
  "none",
  "customer_pii",
  "employee_pii",
  "financial",
  "health",
  "confidential_business",
]);

export const DecisionAuthoritySchema = z.enum([
  "informational_only",
  "recommendations",
  "semi_automated",
  "fully_automated",
]);

export const OpportunityProcessInputSchema = z.object({
  opportunityId: z.string(),
  processMethod: ProcessMethodSchema,
  frequency: FrequencySchema,
  duration: DurationSchema,
  employeesInvolved: EmployeesInvolvedSchema,
});

export const AssessmentProfileSchema = z.object({
  employeeCount: EmployeeCountSchema,
  industry: IndustrySchema,
  primaryGoal: BusinessGoalSchema,
  timeSpentAreas: z.array(TimeSpentAreaSchema).min(1),
  topFrustrations: z.array(FrustrationSchema).max(3),
  repetitiveLevel: RepetitiveLevelSchema,
  repetitiveTasks: z.array(RepetitiveTaskSchema).min(1),
  hourlyCost: HourlyCostSchema,
  processInputs: z.array(OpportunityProcessInputSchema),
  dataQuality: DataQualitySchema,
  processStandardization: ProcessStandardizationSchema,
  technicalCapacity: TechnicalCapacitySchema,
  employeeReadiness: EmployeeReadinessSchema,
  sensitiveData: z.array(SensitiveDataSchema),
  decisionAuthority: DecisionAuthoritySchema,
});

export type AssessmentProfile = z.infer<typeof AssessmentProfileSchema>;
export type OpportunityProcessInput = z.infer<typeof OpportunityProcessInputSchema>;

export const ComplexityLevelSchema = z.enum(["Low", "Medium", "High"]);
export const GovernanceLevelSchema = z.enum(["Low", "Moderate", "High", "Very High"]);
export const DataRequirementSchema = z.enum(["Low", "Medium", "High"]);
export const ConfidenceLevelSchema = z.enum(["high", "moderate", "low"]);
export const RecommendationCategorySchema = z.enum([
  "priority_opportunity",
  "pilot",
  "improve_process_first",
  "further_assessment",
  "not_recommended",
]);

export const EvidenceTypeSchema = z.enum(["evidence", "assumption", "user_input"]);

export const EfficiencyAssumptionSchema = z.object({
  id: z.string(),
  range: z.object({ low: z.number(), high: z.number() }),
  confidence: ConfidenceLevelSchema,
  source: z.string(),
  date: z.string(),
  notes: z.string(),
});

export const OpportunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  ai_type: z.array(z.string()),
  typical_value_drivers: z.array(z.string()),
  implementation_complexity: ComplexityLevelSchema,
  data_requirement: DataRequirementSchema,
  governance_level: GovernanceLevelSchema,
  human_oversight: z.enum(["Required", "Recommended", "Optional"]),
  pain_point_tags: z.array(z.string()),
  repetitive_task_tags: z.array(z.string()),
  frustration_tags: z.array(z.string()),
  industry_hints: z.array(IndustrySchema),
  efficiency_assumption_id: z.string(),
  cost_assumption_id: z.string(),
  not_recommended_when: z.array(z.string()),
  secondary_value_flags: z.array(z.string()),
  high_risk: z.boolean().default(false),
});

export type Opportunity = z.infer<typeof OpportunitySchema>;

export const CostBandSchema = z.object({
  id: z.string(),
  first_year_cost_cad: z.object({ low: z.number(), high: z.number() }),
  annual_operating_cost_cad: z.object({ low: z.number(), high: z.number() }),
  cost_drivers: z.array(z.string()),
  assumption_id: z.string(),
  confidence: ConfidenceLevelSchema,
  source: z.string(),
  date: z.string(),
  notes: z.string(),
});

export type CostBand = z.infer<typeof CostBandSchema>;

export const ValueEstimateSchema = z.object({
  annualTimeValueLow: z.number(),
  annualTimeValueHigh: z.number(),
  formula: z.string(),
  inputs: z.record(z.string(), z.union([z.string(), z.number()])),
});

export type ValueEstimate = z.infer<typeof ValueEstimateSchema>;

export const RoiEstimateSchema = z.object({
  firstYearRoiLow: z.number(),
  firstYearRoiHigh: z.number(),
  netBenefitLow: z.number(),
  netBenefitHigh: z.number(),
  firstYearCostLow: z.number(),
  firstYearCostHigh: z.number(),
});

export type RoiEstimate = z.infer<typeof RoiEstimateSchema>;

export const OpportunityResultSchema = z.object({
  opportunity: OpportunitySchema,
  matchScore: z.number(),
  value: ValueEstimateSchema,
  cost: CostBandSchema,
  roi: RoiEstimateSchema,
  feasibilityScore: z.number(),
  governanceRisk: GovernanceLevelSchema,
  compositeScore: z.number(),
  recommendation: RecommendationCategorySchema,
  confidence: ConfidenceLevelSchema,
  quadrant: z.enum(["quick_win", "strategic", "opportunistic", "defer"]),
  riskQuadrant: z.enum([
    "high_value_low_risk",
    "high_value_high_risk",
    "low_value_low_risk",
    "low_value_high_risk",
  ]),
  secondaryValueFlags: z.array(z.string()),
  governanceCapApplied: z.boolean(),
  explainability: z.object({
    valueSteps: z.array(z.string()),
    roiSteps: z.array(z.string()),
    feasibilityFactors: z.array(z.string()),
    governanceFactors: z.array(z.string()),
    confidenceFactors: z.array(z.string()),
  }),
});

export type OpportunityResult = z.infer<typeof OpportunityResultSchema>;

export const PilotPlanSchema = z.object({
  objective: z.string(),
  baseline: z.string(),
  successMetrics: z.array(z.string()),
  durationWeeks: z.object({ low: z.number(), high: z.number() }),
  goNoGo: z.string(),
});

export const RoadmapPhaseSchema = z.object({
  phase: z.number(),
  title: z.string(),
  opportunityId: z.string(),
  timeWeeks: z.object({ low: z.number(), high: z.number() }),
  expectedValue: z.string(),
  risk: GovernanceLevelSchema,
});

export type PilotPlan = z.infer<typeof PilotPlanSchema>;
export type RoadmapPhase = z.infer<typeof RoadmapPhaseSchema>;

export const AssessmentResultSchema = z.object({
  profile: AssessmentProfileSchema,
  opportunities: z.array(OpportunityResultSchema),
  overallOpportunityLevel: z.enum([
    "Low",
    "Moderate",
    "Moderate–High",
    "High",
  ]),
  totalValueLow: z.number(),
  totalValueHigh: z.number(),
  totalFirstYearCostLow: z.number(),
  totalFirstYearCostHigh: z.number(),
  portfolioRoiLow: z.number(),
  portfolioRoiHigh: z.number(),
  overallConfidence: ConfidenceLevelSchema,
  improveProcessFirst: z.boolean(),
  aiNotRecommended: z.boolean(),
  roadmap: z.array(RoadmapPhaseSchema),
  pilots: z.record(z.string(), PilotPlanSchema),
  brukdCta: z.object({
    show: z.boolean(),
    reasons: z.array(z.string()),
  }),
});

export type AssessmentResult = z.infer<typeof AssessmentResultSchema>;

export const QUESTIONNAIRE_STEPS = [
  "business_profile",
  "pain_points",
  "repetitive_work",
  "process_details",
  "employee_cost",
  "feasibility_inputs",
  "risk_governance",
] as const;

export type QuestionnaireStep = (typeof QUESTIONNAIRE_STEPS)[number];
