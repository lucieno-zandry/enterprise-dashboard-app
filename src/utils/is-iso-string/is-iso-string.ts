import type { ISOString } from "../../data/models";
import { isString } from "../is-string/is-string";

export const isISOString = (value: unknown): value is ISOString => {
    if (isString(value)) {
        const date = new Date(value);
        if (!isNaN(date?.getDate?.())) return true;
    }

    return false;
}