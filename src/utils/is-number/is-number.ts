export const isNumber = (value: unknown): value is number => {
    if (typeof value === "number" && Number.isFinite(value) && !Number.isNaN(value)) return true;
    return false;
}