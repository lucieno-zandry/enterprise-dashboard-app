// src/utils/isNumber.test.ts
import { describe, it, expect } from 'vitest'
import { isNumber } from './is-number'

describe('isNumber', () => {
    it('returns true for an actual number', () => {
        // Arrange
        const input = 42

        // Act
        const result = isNumber(input)

        // Assert
        expect(result).toBe(true)
    })

    it.each([
        { input: "", why: "an empty string" },
        { input: "   ", why: "a whitespace" }
    ])('returns FALSE for $input (why: $why)', ({ input }) => { expect(isNumber(input)).toBe(false) })
})