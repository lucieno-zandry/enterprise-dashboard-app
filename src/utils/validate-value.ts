import type { ValidationErrors } from "../data/app-types";
import type { ISOString, MetricsReport } from "../data/models";
import { getMetricReportsValidationError, type GetMetricReportsValidationError } from "./get-metric-reports-validation-error";

export const isNumber = (value: unknown): value is Number => {
    if (typeof value === "number" || !isNaN(Number(value))) return true;
    return false;
}

export const isString = (value: unknown): value is string => {
    if (value === "" || typeof value === "string") return true;
    return false;
}

export const isISOString = (value: unknown): value is ISOString => {
    if (isString(value)) {
        const date = new Date(value);
        if (!isNaN(date?.getDate?.())) return true;
    }

    return false;
}

export const isMetricStatus = (value: unknown): value is MetricsReport['status'] => {
    const statuses: MetricsReport['status'][] = ['active', 'archived', 'failed'];
    if (isString(value) && statuses.includes(value as MetricsReport['status'])) return true;

    return false;
}

export const isRecord = (value: unknown): value is Record<string, unknown> => {
    if (value && typeof value === "object") return true;
    return false;
}

export const isArrayOf = (type: 'string' | 'number', value: unknown) => {
    if (value && typeof value === "object" && Object.values(value).every((v) => typeof v === type)) return true;

    return false;
}

export const isMetrics = (value: unknown): value is MetricsReport['metrics'] => {
    if (isRecord(value) && isArrayOf('number', value)) return true;

    return false;
}

export const validateMetricsData = (report: unknown, getMessage: GetMetricReportsValidationError = getMetricReportsValidationError): {
    errors: ValidationErrors<MetricsReport>,
    success: boolean,
} => {
    const errors: ValidationErrors<MetricsReport> = {
        id: [],
        metrics: [],
        status: [],
        updated_at: [],
        created_at: [],
    };

    let success = true;

    const onInvalid = (key: keyof MetricsReport) => {
        errors[key]!.push(getMessage(key));
        success = false;
    }

    if (report && typeof report === "object") {
        Object.entries(report).forEach((entry) => {
            const key = entry[0] as keyof MetricsReport;
            const value = entry[1];

            if (key === "id") {
                if (!isString(value)) onInvalid(key);
            } else if (key === "created_at" || key === "updated_at") {
                if (!isISOString(value)) onInvalid(key);
            } else if (key === "metrics") {
                if (!isMetrics(value)) onInvalid(key);
            } else if (key === "status") {
                if (!isMetricStatus(value)) onInvalid(key);
            }
        })
    }

    return {
        errors,
        success,
    }
}

export const isMetricsReport = (value: unknown): value is MetricsReport => {
    return validateMetricsData(value).success;
}

export const isValidationErrors = (value: unknown): value is ValidationErrors => {
    if (isRecord(value) && isArrayOf('string', value)) return true;
    return false;
}