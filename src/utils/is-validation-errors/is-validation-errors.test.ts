import { describe, expect, it } from "vitest"
import { isValidationErrors } from "./is-validation-errors"

describe('isValidationErrors', () => {
    it('accepts an empty object', () => {
        expect(isValidationErrors({})).toBe(true)
    })

    it('accepts a record of string arrays', () => {
        expect(isValidationErrors({
            id: ['error'],
            status: ['a', 'b'],
            metrics: [],
        })).toBe(true)
    })

    it('rejects a record with a non-array value', () => {
        expect(isValidationErrors({ id: 'error' })).toBe(false)
        expect(isValidationErrors({ id: { nested: 'x' } })).toBe(false)
    })

    it('rejects a record with an array of non-strings', () => {
        expect(isValidationErrors({ id: [1, 2] })).toBe(false)
        expect(isValidationErrors({ id: ['ok', 42] })).toBe(false)
    })

    it('rejects non-records', () => {
        for (const input of [null, undefined, 42, 'x', true, [], [['a']]]) {
            expect(isValidationErrors(input)).toBe(false)
        }
    })
})