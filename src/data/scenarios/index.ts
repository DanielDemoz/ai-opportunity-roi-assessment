import type { AssessmentProfile } from "@/lib/schemas";

export type DemoScenario = {
  id: string;
  name: string;
  description: string;
  profile: AssessmentProfile;
  expectedOutcomes: {
    minOpportunities: number;
    shouldInclude?: string[];
    shouldNotRecommend?: string[];
    minRecommendation?: string[];
    governanceCap?: boolean;
  };
};

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "professional-services",
    name: "Small Professional Services Firm",
    description: "20 employees, excessive email, document processing, reporting",
    profile: {
      employeeCount: "6_20",
      industry: "professional_services",
      primaryGoal: "save_time",
      timeSpentAreas: ["email", "document_processing", "reporting"],
      topFrustrations: ["repetitive_work", "manual_document_processing", "too_much_reporting"],
      repetitiveLevel: "significant",
      repetitiveTasks: ["writing_emails", "reading_documents", "creating_reports"],
      hourlyCost: "40_60",
      processInputs: [
        {
          opportunityId: "customer-email-assistant",
          processMethod: "completely_manual",
          frequency: "several_per_day",
          duration: "30_60_min",
          employeesInvolved: "2_5",
        },
        {
          opportunityId: "document-extraction",
          processMethod: "spreadsheet",
          frequency: "daily",
          duration: "1_2_hours",
          employeesInvolved: "2_5",
        },
        {
          opportunityId: "report-generation",
          processMethod: "spreadsheet",
          frequency: "weekly",
          duration: "1_2_hours",
          employeesInvolved: "2_5",
        },
      ],
      dataQuality: "good",
      processStandardization: "somewhat_standard",
      technicalCapacity: "limited",
      employeeReadiness: "open",
      sensitiveData: ["customer_pii", "confidential_business"],
      decisionAuthority: "informational_only",
    },
    expectedOutcomes: {
      minOpportunities: 3,
      shouldInclude: ["customer-email-assistant", "document-extraction", "report-generation"],
      minRecommendation: ["pilot", "priority_opportunity"],
    },
  },
  {
    id: "hvac-company",
    name: "HVAC Company",
    description: "15 employees, scheduling, customer calls, job costing",
    profile: {
      employeeCount: "6_20",
      industry: "construction_trades",
      primaryGoal: "improve_customer_service",
      timeSpentAreas: ["scheduling", "customer_inquiries", "bookkeeping"],
      topFrustrations: ["difficult_scheduling", "slow_customer_response", "too_much_admin"],
      repetitiveLevel: "moderate",
      repetitiveTasks: ["scheduling", "answering_similar_questions", "data_entry"],
      hourlyCost: "30_40",
      processInputs: [
        {
          opportunityId: "scheduling-optimization",
          processMethod: "spreadsheet",
          frequency: "daily",
          duration: "30_60_min",
          employeesInvolved: "2_5",
        },
        {
          opportunityId: "customer-email-assistant",
          processMethod: "completely_manual",
          frequency: "several_per_day",
          duration: "15_30_min",
          employeesInvolved: "2_5",
        },
        {
          opportunityId: "invoice-processing",
          processMethod: "completely_manual",
          frequency: "weekly",
          duration: "1_2_hours",
          employeesInvolved: "1",
        },
      ],
      dataQuality: "mixed",
      processStandardization: "somewhat_standard",
      technicalCapacity: "limited",
      employeeReadiness: "neutral",
      sensitiveData: ["customer_pii"],
      decisionAuthority: "informational_only",
    },
    expectedOutcomes: {
      minOpportunities: 2,
      shouldInclude: ["scheduling-optimization", "customer-email-assistant"],
    },
  },
  {
    id: "marketing-agency",
    name: "Marketing Agency",
    description: "12 employees, content production, research, reporting",
    profile: {
      employeeCount: "6_20",
      industry: "marketing_creative",
      primaryGoal: "improve_productivity",
      timeSpentAreas: ["marketing", "research", "reporting"],
      topFrustrations: ["repetitive_work", "too_much_reporting", "difficulty_scaling"],
      repetitiveLevel: "significant",
      repetitiveTasks: ["creating_reports", "writing_emails", "creating_summaries"],
      hourlyCost: "40_60",
      processInputs: [
        {
          opportunityId: "content-generation",
          processMethod: "existing_software",
          frequency: "daily",
          duration: "1_2_hours",
          employeesInvolved: "2_5",
        },
        {
          opportunityId: "report-generation",
          processMethod: "spreadsheet",
          frequency: "weekly",
          duration: "2_4_hours",
          employeesInvolved: "2_5",
        },
      ],
      dataQuality: "good",
      processStandardization: "well_defined",
      technicalCapacity: "some",
      employeeReadiness: "eager",
      sensitiveData: ["customer_pii"],
      decisionAuthority: "informational_only",
    },
    expectedOutcomes: {
      minOpportunities: 2,
      shouldInclude: ["content-generation", "report-generation"],
    },
  },
  {
    id: "healthcare-clinic",
    name: "Healthcare Clinic",
    description: "25 employees, scheduling, no-shows, administrative workload",
    profile: {
      employeeCount: "21_50",
      industry: "healthcare",
      primaryGoal: "save_time",
      timeSpentAreas: ["scheduling", "administrative", "customer_inquiries"],
      topFrustrations: ["difficult_scheduling", "too_much_admin", "slow_customer_response"],
      repetitiveLevel: "moderate",
      repetitiveTasks: ["scheduling", "answering_similar_questions", "data_entry"],
      hourlyCost: "30_40",
      processInputs: [
        {
          opportunityId: "scheduling-optimization",
          processMethod: "existing_software",
          frequency: "daily",
          duration: "30_60_min",
          employeesInvolved: "2_5",
        },
        {
          opportunityId: "customer-faq-assistant",
          processMethod: "completely_manual",
          frequency: "several_per_day",
          duration: "15_30_min",
          employeesInvolved: "2_5",
        },
      ],
      dataQuality: "mixed",
      processStandardization: "somewhat_standard",
      technicalCapacity: "limited",
      employeeReadiness: "neutral",
      sensitiveData: ["health", "customer_pii"],
      decisionAuthority: "informational_only",
    },
    expectedOutcomes: {
      minOpportunities: 2,
      shouldInclude: ["scheduling-optimization"],
      governanceCap: true,
    },
  },
];

export function getScenarioById(id: string): DemoScenario | undefined {
  return DEMO_SCENARIOS.find((s) => s.id === id);
}
