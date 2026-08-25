import type { RoiEstimate, ValueEstimate } from "@/lib/schemas";
import type { CostBand } from "@/lib/schemas";

export function calculateRoi(
  value: ValueEstimate,
  cost: CostBand,
): RoiEstimate {
  const valueMidLow = value.annualTimeValueLow;
  const valueMidHigh = value.annualTimeValueHigh;

  const firstYearCostLow = cost.first_year_cost_cad.low;
  const firstYearCostHigh = cost.first_year_cost_cad.high;

  const netBenefitLow = valueMidLow - firstYearCostHigh;
  const netBenefitHigh = valueMidHigh - firstYearCostLow;

  const firstYearRoiLow =
    firstYearCostHigh > 0
      ? (netBenefitLow / firstYearCostHigh) * 100
      : 0;
  const firstYearRoiHigh =
    firstYearCostLow > 0
      ? (netBenefitHigh / firstYearCostLow) * 100
      : 0;

  return {
    firstYearRoiLow: Math.round(firstYearRoiLow),
    firstYearRoiHigh: Math.round(firstYearRoiHigh),
    netBenefitLow: Math.round(netBenefitLow),
    netBenefitHigh: Math.round(netBenefitHigh),
    firstYearCostLow,
    firstYearCostHigh,
  };
}

export function roiScoreFromEstimate(roi: RoiEstimate): number {
  const mid = (roi.firstYearRoiLow + roi.firstYearRoiHigh) / 2;
  if (mid >= 100) return 90;
  if (mid >= 50) return 75;
  if (mid >= 25) return 60;
  if (mid >= 0) return 40;
  if (mid >= -25) return 25;
  return 10;
}
