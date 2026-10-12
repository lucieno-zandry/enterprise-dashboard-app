import type { MetricsReport } from "../../data/models";
import { validateMetricsData } from "../validate-metrics-data/validate-metrics-data";

export const isMetricsReport = (value: unknown): value is MetricsReport => {
    return validateMetricsData(value).success;
}