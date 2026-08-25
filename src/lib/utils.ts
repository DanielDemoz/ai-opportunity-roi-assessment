import { CAD_FORMAT } from "@/lib/constants";

export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCadRange(low: number, high: number): string {
  return `${CAD_FORMAT.format(low)}–${CAD_FORMAT.format(high)}`;
}

export function formatPercentRange(low: number, high: number): string {
  return `${Math.round(low)}–${Math.round(high)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
