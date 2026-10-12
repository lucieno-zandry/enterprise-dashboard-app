import type { ValidationErrors } from "../../data/app-types";

export const isValidationSuccess = (errors: ValidationErrors) => {
    const values: string[][] = Object.values(errors);

    for (const value of values) {
        if (value && value.length > 0) return false;
    }

    return true;
}
