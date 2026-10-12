import type { MetricsReport } from "../../data/models";
import { isNumber } from "../is-number/is-number";
import { isRecord } from "../is-record/is-record";

export const isMetrics = (value: unknown): value is MetricsReport['metrics'] => {
    if (isRecord(value) && Object.values(value).every(isNumber)) return true;

    return false;
}
