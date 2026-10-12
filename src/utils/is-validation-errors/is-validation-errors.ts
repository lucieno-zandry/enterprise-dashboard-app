import type { ValidationErrors } from "../../data/app-types";
import { isArrayOf } from "../is-array-of/is-array-of";
import { isRecord } from "../is-record/is-record";

export const isValidationErrors = (value: unknown): value is ValidationErrors => {
    if (isRecord(value)) {
        for (const array of Object.values(value)) {
            if (!isArrayOf('string', array)) return false;
        }

        return true;
    }

    return false;
}