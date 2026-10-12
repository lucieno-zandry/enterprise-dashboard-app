import type { ValidationErrors } from "../data/app-types";
import type { MetricsReport } from "../data/models";

const errors: ValidationErrors<MetricsReport> = {
    id: ["ID is required and must be a non-string"],
    created_at: ["Invalid ISO date string for created_at"],
    updated_at: ["Invalid ISO date string for updated_at"],
    status: ["Invalid metric status"],
    metrics: ["Metrics must be a Record<string, number>"],
}

export type GetMetricReportsValidationErrors = (t: keyof typeof errors) => string[];

export const getMetricReportsValidationErrors: GetMetricReportsValidationErrors = (t) => errors[t] || [];