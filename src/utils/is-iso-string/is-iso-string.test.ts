import { describe, expect, it } from "vitest";
import { isISOString } from "./is-iso-string";

describe('ISOString', () => {
    it('returns TRUE for a date string', () => {
        expect(isISOString('2025-10-12')).toBe(true);
    })

    it.each([
        { input: "abcde", why: "Not an actual date string" },
        { input: 123, why: "A number" }
    ])('returns FALSE for $input ($why)', ({ input }) => {
        expect(isISOString(input)).toBe(false);
    })
})