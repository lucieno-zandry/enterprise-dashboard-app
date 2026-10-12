// src/utils/is-array-of/is-array-of.test.ts
import { describe, it, expect } from 'vitest'
import { isArrayOf } from './is-array-of'

describe('isArrayOf', () => {
    describe('accepts arrays whose elements all match', () => {
        it.each([
            ['number', [1, 2, 3]],
            ['number', [3.14, -1, 0]],
            ['string', ['a', 'b']],
            ['string', ['']],
            ['number', []],
            ['string', []],
        ] as const)('isArrayOf(%s, %o)', (type, input) => {
            expect(isArrayOf(type, input)).toBe(true)
        })
    })

    describe('rejects arrays with a mismatched element', () => {
        it.each([
            ['number', [1, 'a']],
            ['string', ['a', 1]],
            ['number', [1, null]],
            ['number', [1, undefined]],
            ['string', ['a', true]],
            ['number', [[1], [2]]],
            ['string', [{ a: 'x' }]],
        ] as const)('isArrayOf(%s, %o)', (type, input) => {
            expect(isArrayOf(type, input)).toBe(false)
        })
    })

    describe('rejects non-arrays', () => {
        it.each([
            ['string', {}],
            ['number', {}],
            ['string', { a: 'x' }],
            ['number', { a: 1, b: 2 }],
            ['number', new Date()],
            ['number', new Map()],
            ['number', new Set()],
            ['string', 'abc'],
            ['number', 42],
            ['string', null],
            ['string', undefined],
            ['string', () => { }],
        ] as const)('isArrayOf(%s, %o)', (type, input) => {
            expect(isArrayOf(type, input)).toBe(false)
        })
    })

    describe('the type guard narrows correctly', () => {
        it('narrows to string[]', () => {
            const value: unknown = ['a', 'b']

            if (isArrayOf('string', value)) {
                const first: string = value[0]
                expect(first).toBe('a')
            }
        })

        it('narrows to number[]', () => {
            const value: unknown = [1, 2]

            if (isArrayOf('number', value)) {
                const sum: number = value.reduce((a, b) => a + b, 0)
                expect(sum).toBe(3)
            }
        })
    })
})