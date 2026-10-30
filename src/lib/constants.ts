/** Canadian SMB convention, clearly labeled default */
export const WORKING_DAYS_PER_YEAR = 220;

export const DEFAULT_HOURLY_COST_CAD = 32;

export const DISCLAIMER =
  "This assessment provides indicative, scenario-based estimates, not financial forecasts, legal advice, or guaranteed savings.";

export const CAD_FORMAT = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export const BRUKD_URL = "https://brukdconsultancy.com/";

export const MAX_MATCHED_OPPORTUNITIES = 7;
export const DEEP_DIVE_OPPORTUNITY_COUNT = 3;
