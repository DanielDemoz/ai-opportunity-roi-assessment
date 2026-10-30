export const EMPLOYEE_COUNT_OPTIONS = [
  { id: "1_5", label: "1–5" },
  { id: "6_20", label: "6–20" },
  { id: "21_50", label: "21–50" },
  { id: "51_100", label: "51–100" },
  { id: "101_250", label: "101–250" },
  { id: "250_plus", label: "250+" },
];

export const INDUSTRY_OPTIONS = [
  { id: "professional_services", label: "Professional services" },
  { id: "retail", label: "Retail" },
  { id: "healthcare", label: "Healthcare" },
  { id: "education", label: "Education" },
  { id: "construction_trades", label: "Construction / trades" },
  { id: "finance_accounting", label: "Finance / accounting" },
  { id: "marketing_creative", label: "Marketing / creative" },
  { id: "technology", label: "Technology" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "hospitality", label: "Hospitality" },
  { id: "transportation_logistics", label: "Transportation / logistics" },
  { id: "non_profit", label: "Non-profit" },
  { id: "other", label: "Other" },
];

export const GOAL_OPTIONS = [
  { id: "reduce_costs", label: "Reduce operating costs" },
  { id: "save_time", label: "Save employee time" },
  { id: "increase_revenue", label: "Increase revenue" },
  { id: "improve_customer_service", label: "Improve customer service" },
  { id: "improve_quality", label: "Improve quality" },
  { id: "reduce_errors", label: "Reduce errors" },
  { id: "scale_operations", label: "Scale operations" },
  { id: "improve_decision_making", label: "Improve decision-making" },
  { id: "improve_productivity", label: "Improve employee productivity" },
  { id: "other", label: "Other" },
];

export const TIME_SPENT_OPTIONS = [
  { id: "email", label: "Email" },
  { id: "administrative", label: "Administrative work" },
  { id: "data_entry", label: "Data entry" },
  { id: "customer_inquiries", label: "Customer inquiries" },
  { id: "scheduling", label: "Scheduling" },
  { id: "document_processing", label: "Document processing" },
  { id: "reporting", label: "Reporting" },
  { id: "marketing", label: "Marketing" },
  { id: "sales_follow_up", label: "Sales follow-up" },
  { id: "bookkeeping", label: "Bookkeeping" },
  { id: "research", label: "Research" },
  { id: "employee_onboarding", label: "Employee onboarding" },
  { id: "customer_support", label: "Customer support" },
  { id: "inventory_management", label: "Inventory management" },
  { id: "data_analysis", label: "Data analysis" },
  { id: "other", label: "Other" },
];

export const FRUSTRATION_OPTIONS = [
  { id: "repetitive_work", label: "Too much repetitive work" },
  { id: "searching_information", label: "Employees spend too much time searching for information" },
  { id: "slow_customer_response", label: "Slow customer response" },
  { id: "manual_document_processing", label: "Manual document processing" },
  { id: "too_many_errors", label: "Too many errors" },
  { id: "too_much_reporting", label: "Too much reporting work" },
  { id: "difficult_scheduling", label: "Difficult scheduling" },
  { id: "difficult_forecasting", label: "Difficult forecasting" },
  { id: "too_much_admin", label: "Too much administrative work" },
  { id: "difficulty_scaling", label: "Difficulty scaling" },
  { id: "missed_sales", label: "Missed sales opportunities" },
  { id: "high_operating_costs", label: "High operating costs" },
];

export const REPETITIVE_LEVEL_OPTIONS = [
  { id: "very_little", label: "Very little" },
  { id: "some", label: "Some" },
  { id: "moderate", label: "Moderate amount" },
  { id: "significant", label: "Significant amount" },
  { id: "large_portion", label: "A large portion" },
];

export const REPETITIVE_TASK_OPTIONS = [
  { id: "copying_between_systems", label: "Copying information between systems" },
  { id: "reading_documents", label: "Reading documents" },
  { id: "writing_emails", label: "Writing emails" },
  { id: "creating_reports", label: "Creating reports" },
  { id: "answering_similar_questions", label: "Answering similar questions" },
  { id: "scheduling", label: "Scheduling" },
  { id: "data_entry", label: "Data entry" },
  { id: "data_cleaning", label: "Data cleaning" },
  { id: "creating_summaries", label: "Creating summaries" },
  { id: "reviewing_forms", label: "Reviewing applications / forms" },
  { id: "customer_follow_up", label: "Customer follow-up" },
  { id: "other", label: "Other" },
];

export const PROCESS_METHOD_OPTIONS = [
  { id: "completely_manual", label: "Completely manual" },
  { id: "spreadsheet", label: "Spreadsheet-based" },
  { id: "existing_software", label: "Existing software" },
  { id: "rule_based_automation", label: "Rule-based automation" },
  { id: "ai_assisted", label: "AI-assisted" },
  { id: "fully_automated", label: "Fully automated" },
  { id: "not_sure", label: "Not sure" },
];

export const FREQUENCY_OPTIONS = [
  { id: "several_per_day", label: "Several times per day" },
  { id: "daily", label: "Daily" },
  { id: "several_per_week", label: "Several times per week" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "occasionally", label: "Occasionally" },
];

export const DURATION_OPTIONS = [
  { id: "under_15_min", label: "Less than 15 minutes" },
  { id: "15_30_min", label: "15–30 minutes" },
  { id: "30_60_min", label: "30–60 minutes" },
  { id: "1_2_hours", label: "1–2 hours" },
  { id: "2_4_hours", label: "2–4 hours" },
  { id: "over_4_hours", label: "More than 4 hours" },
];

export const EMPLOYEES_INVOLVED_OPTIONS = [
  { id: "1", label: "1" },
  { id: "2_5", label: "2–5" },
  { id: "6_10", label: "6–10" },
  { id: "10_plus", label: "10+" },
];

export const HOURLY_COST_OPTIONS = [
  { id: "under_20", label: "Under $20/hour" },
  { id: "20_30", label: "$20–30" },
  { id: "30_40", label: "$30–40" },
  { id: "40_60", label: "$40–60" },
  { id: "60_80", label: "$60–80" },
  { id: "80_plus", label: "$80+" },
  { id: "dont_know", label: "I don't know" },
];

export const DATA_QUALITY_OPTIONS = [
  { id: "poor", label: "Poor, inconsistent or incomplete" },
  { id: "mixed", label: "Mixed, some good, some problematic" },
  { id: "good", label: "Good, reliable and structured" },
  { id: "not_sure", label: "Not sure" },
];

export const PROCESS_STANDARDIZATION_OPTIONS = [
  { id: "inconsistent", label: "Inconsistent, varies by person or situation" },
  { id: "somewhat_standard", label: "Somewhat standardized" },
  { id: "well_defined", label: "Well defined and documented" },
  { id: "not_sure", label: "Not sure" },
];

export const TECHNICAL_CAPACITY_OPTIONS = [
  { id: "none", label: "None, no IT support" },
  { id: "limited", label: "Limited, occasional help" },
  { id: "some", label: "Some, part-time or contracted IT" },
  { id: "strong", label: "Strong, dedicated IT resources" },
];

export const EMPLOYEE_READINESS_OPTIONS = [
  { id: "resistant", label: "Resistant to change" },
  { id: "neutral", label: "Neutral" },
  { id: "open", label: "Open to new tools" },
  { id: "eager", label: "Eager to try AI assistance" },
];

export const SENSITIVE_DATA_OPTIONS = [
  { id: "none", label: "None of these" },
  { id: "customer_pii", label: "Customer personal information" },
  { id: "employee_pii", label: "Employee personal information" },
  { id: "financial", label: "Financial data" },
  { id: "health", label: "Health information" },
  { id: "confidential_business", label: "Confidential business information" },
];

export const DECISION_AUTHORITY_OPTIONS = [
  { id: "informational_only", label: "Informational only, humans decide everything" },
  { id: "recommendations", label: "AI provides recommendations for human approval" },
  { id: "semi_automated", label: "Semi-automated, AI acts with human oversight" },
  { id: "fully_automated", label: "Fully automated decisions" },
];

export const STEP_TITLES: Record<string, { title: string; subtitle: string }> = {
  business_profile: {
    title: "Business Profile",
    subtitle: "Tell us about your business so we can identify relevant opportunities.",
  },
  pain_points: {
    title: "Business Challenges",
    subtitle: "Where does your business spend too much time?",
  },
  repetitive_work: {
    title: "Repetitive Work",
    subtitle: "Help us identify automation and AI assistance opportunities.",
  },
  process_details: {
    title: "Current Processes",
    subtitle: "For your top matched opportunities, how are these tasks performed today?",
  },
  employee_cost: {
    title: "Employee Cost / Time Value",
    subtitle: "Approximate hourly cost helps estimate opportunity value. Exact salary not required.",
  },
  feasibility_inputs: {
    title: "Feasibility",
    subtitle: "Help us assess whether AI could realistically work in your environment.",
  },
  risk_governance: {
    title: "Risk & Governance",
    subtitle: "Lightweight check, this is not a full governance assessment.",
  },
};
