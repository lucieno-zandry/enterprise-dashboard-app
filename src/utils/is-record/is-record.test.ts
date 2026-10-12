// src/utils/is-record/is-record.test.ts
import { describe, it, expect } from 'vitest'
import { isRecord } from './is-record'

describe('isRecord', () => {
    describe('returns true for records', () => {
        it.each([
            [{}, 'empty object'],
            [{ a: 1 }, 'object with a key'],
            [{ a: 1, b: 'two' }, 'object with mixed value types'],
            [{ nested: { deep: true } }, 'nested object'],
            [Object.create(null), 'null-prototype object'],
        ])('%s — %s', (input) => {
            expect(isRecord(input)).toBe(true)
        })
    })

    describe('returns false for arrays', () => {
        it.each([
            [[]],
            [[1, 2, 3]],
            [Array.from({ length: 3 })],
        ])('%o', (input) => {
            expect(isRecord(input)).toBe(false)
        })
    })

    describe('returns false for built-in objects', () => {
        it.each([
            [new Date()],
            [/regex/],
            [new Map()],
            [new Set()],
            [new Error('x')],
            [new Number(5)],
            [new String('')],
            [new Boolean(false)],
        ])('%o', (input) => {
            expect(isRecord(input)).toBe(false)
        })
    })

    describe('returns false for class instances', () => {
        class Foo {
            bar = 1
        }

        it('rejects instances of a custom class', () => {
            expect(isRecord(new Foo())).toBe(false)
        })
    })

    describe('returns false for nullish values', () => {
        it.each([
            [null],
            [undefined],
        ])('%o', (input) => {
            expect(isRecord(input)).toBe(false)
        })
    })

    describe('returns false for primitives', () => {
        it.each([
            [0],
            [42],
            [NaN],
            [Infinity],
            [-3.14],
            [0n],
            [''],
            ['hello'],
            [true],
            [false],
            [Symbol('x')],
        ])('%o', (input) => {
            expect(isRecord(input)).toBe(false)
        })
    })

    describe('returns false for functions', () => {
        it.each([
            [() => { }],
            [function named() { }],
            [class C { }],
        ])('%o', (input) => {
            expect(isRecord(input)).toBe(false)
        })
    })

    describe('the type guard is sound', () => {
        it('does not narrow arrays to Record', () => {
            const arr: unknown = [1, 2, 3]

            if (isRecord(arr)) {
                // @ts-expect-error — isRecord should reject arrays, so this branch is unreachable
                arr.push(4)
            }
        })

        it('narrows a real record so you can index it', () => {
            const value: unknown = { name: 'ada' }

            if (isRecord(value)) {
                expect(value['name']).toBe('ada')
                expect(value['missing']).toBeUndefined()
            }
        })
    })
})