// src/utils/is-metrics/is-metrics.test.ts
import { describe, it, expect } from 'vitest'
import { isMetrics } from './is-metrics'

describe('isMetrics', () => {
    describe('accepts records of numbers', () => {
        it.each([
            [{}],
            [{ a: 1 }],
            [{ a: 1, b: 2 }],
            [{ cpu: 0.5, memory: 0.8 }],
            [{ x: -1, y: 0, z: 3.14 }],
            [{ big: 1e10, small: 1e-10 }],
        ])('%o', (input) => {
            expect(isMetrics(input)).toBe(true)
        })
    })

    describe('rejects records with any non-number value', () => {
        it.each([
            [{ a: 'x' }],
            [{ a: 1, b: 'x' }],
            [{ a: null }],
            [{ a: undefined }],
            [{ a: true }],
            [{ a: [1, 2] }],
            [{ a: { nested: 1 } }],
            [{ a: () => 1 }],
        ])('%o', (input) => {
            expect(isMetrics(input)).toBe(false)
        })
    })

    // This block is the whole point. If it fails, `isNumber` or `isRecord`
    // regressed and `isMetrics` inherited the bug.
    describe('does NOT accept numeric strings (requires fixed isNumber)', () => {
        it.each([
            [{ a: '42' }],
            [{ a: '0' }],
            [{ a: '3.14' }],
            [{ a: '1e3' }],
            [{ a: '0x10' }],
            [{ a: '' }],
            [{ a: '   ' }],
        ])('%o', (input) => {
            expect(isMetrics(input)).toBe(false)
        })
    })

    describe('rejects non-records', () => {
        it.each([
            [null],
            [undefined],
            [42],
            ['hello'],
            [true],
            [[]],
            [[1, 2, 3]],
            [new Date()],
            [new Map()],
            [new Set()],
            [() => ({ a: 1 })],
        ])('%o', (input) => {
            expect(isMetrics(input)).toBe(false)
        })
    })

    describe('edge cases', () => {
        it('treats an empty object as valid metrics (vacuous truth)', () => {
            // `{}` IS a valid Record<string, number>. If your caller needs
            // "at least one metric", check Object.keys(value).length > 0.
            expect(isMetrics({})).toBe(true)
        });

        it('rejects NaN values', () => {
            expect(isMetrics({ a: NaN })).toBe(false)
        });

        it('doesn\'t accept Infinity', () => {
            expect(isMetrics({ a: Infinity, b: -Infinity })).toBe(false)
        });

        it('accepts negative zero', () => {
            expect(isMetrics({ a: -0 })).toBe(true)
        });

        it('ignores symbol keys — Object.values skips them', () => {
            const value = { a: 1, [Symbol('x')]: 'not a number' }
            expect(isMetrics(value)).toBe(true)
        });

        it('ignores non-enumerable own properties', () => {
            const value: Record<string, unknown> = { a: 1 }
            Object.defineProperty(value, 'hidden', {
                value: 'not a number',
                enumerable: false,
            })
            expect(isMetrics(value)).toBe(true)
        });
    })

    describe('the type guard narrows correctly', () => {
        it('narrows to Record<string, number>', () => {
            const value: unknown = { cpu: 0.5 }

            if (isMetrics(value)) {
                const cpu: number = value['cpu']
                expect(cpu).toBe(0.5)
            }
        })
    })
})