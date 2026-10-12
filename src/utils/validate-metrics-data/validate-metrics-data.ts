import type { ValidationErrors } from "../../data/app-types";
import type { MetricsReport } from "../../data/models";
import { getMetricReportsValidationErrors, type GetMetricReportsValidationErrors } from "../get-metric-reports-validation-error";
import { isISOString } from "../is-iso-string/is-iso-string";
import { isMetricStatus } from "../is-metric-status/is-metric-status";
import { isMetrics } from "../is-metrics/is-metrics";
import { isRecord } from "../is-record/is-record";
import { isString } from "../is-string/is-string";
import { isValidationSuccess } from "../is-validation-success/is-validation-success";


export const validateMetricsData = (report: unknown, getMessages: GetMetricReportsValidationErrors = getMetricReportsValidationErrors): { errors: ValidationErrors<MetricsReport>; success: boolean } => {
    const errors: ValidationErrors<MetricsReport> = {};
    let success: boolean = false;

    if (report && isRecord(report)) {
        if (!isString(report.id) || report.id.trim().length === 0) errors.id = getMessages("id");
        if (!isISOString(report.created_at)) errors.created_at = getMessages("created_at");
        if (!isISOString(report.updated_at)) errors.updated_at = getMessages("updated_at");
        if (!isMetricStatus(report.status)) errors.status = getMessages("status");
        if (!isMetrics(report.metrics)) errors.metrics = getMessages("metrics");

        success = isValidationSuccess(errors);
    }

    return { errors, success };
};