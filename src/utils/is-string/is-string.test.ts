import { describe, expect, it } from "vitest";
import { isString } from "./is-string";

describe('isString', () => {
    it.each([
        { input: '', why: 'An empty string', },
        { input: '0', why: 'A number string' }
    ])('returns TRUE for $input ($why)', ({ input }) => {
        expect(isString(input)).toBe(true);
    })


    it('returns FALSE for a number', () => {
        expect(isString(0)).toBe(false);
    })

    it('returns FALSE for an array', () => {
        expect(isString(['good', 'bye'])).toBe(false);
    })
})