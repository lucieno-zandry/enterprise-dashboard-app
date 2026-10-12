import type { MetricsReport } from "../../data/models";
import { isString } from "../is-string/is-string";

export const isMetricStatus = (value: unknown): value is MetricsReport['status'] => {
    const statuses: MetricsReport['status'][] = ['active', 'archived', 'failed'];
    if (isString(value) && statuses.includes(value as MetricsReport['status'])) return true;

    return false;
}
