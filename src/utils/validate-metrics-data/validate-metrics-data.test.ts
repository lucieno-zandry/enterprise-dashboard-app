// src/utils/validate-metrics-data/validate-metrics-data.test.ts
import { describe, it, expect, vi } from 'vitest'
import { validateMetricsData } from './validate-metrics-data'
import type { MetricsReport } from '../../data/models'

const validReport = {
    id: 'rpt_123',
    status: 'active',
    metrics: { cpu: 0.5, memory: 0.8 },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z',
}

// Messages are arrays now, matching GetMetricReportsValidationErrors.
const echoMessages = (key: keyof MetricsReport): string[] => [`error:${key}`]

describe('validateMetricsData', () => {
    describe('valid input', () => {
        it('returns success with no errors', () => {
            const result = validateMetricsData(validReport, echoMessages)

            expect(result.success).toBe(true)
            expect(result.errors).toEqual({})
        })
    })

    describe('per-field validation', () => {
        it('flags a missing id', () => {
            const result = validateMetricsData({ ...validReport, id: undefined }, echoMessages)

            expect(result.errors.id).toEqual(['error:id'])
        })

        it('flags a non-string id', () => {
            const result = validateMetricsData({ ...validReport, id: 42 }, echoMessages)

            expect(result.errors.id).toEqual(['error:id'])
        })

        it('flags an empty-string id', () => {
            const result = validateMetricsData({ ...validReport, id: '' }, echoMessages)

            expect(result.errors.id).toEqual(['error:id'])
        })

        it('flags a whitespace-only id', () => {
            const result = validateMetricsData({ ...validReport, id: '   ' }, echoMessages)

            expect(result.errors.id).toEqual(['error:id'])
        })

        it('accepts an id with surrounding whitespace as long as it has content', () => {
            const result = validateMetricsData({ ...validReport, id: '  rpt_123  ' }, echoMessages)

            expect(result.errors.id).toBeUndefined()
        })

        it('flags an invalid status', () => {
            const result = validateMetricsData({ ...validReport, status: 'pending' }, echoMessages)

            expect(result.errors.status).toEqual(['error:status'])
        })

        it('flags an invalid created_at', () => {
            const result = validateMetricsData({ ...validReport, created_at: 'not-a-date' }, echoMessages)

            expect(result.errors.created_at).toEqual(['error:created_at'])
        })

        it('flags an invalid updated_at', () => {
            const result = validateMetricsData({ ...validReport, updated_at: 'yesterday' }, echoMessages)

            expect(result.errors.updated_at).toEqual(['error:updated_at'])
        })

        it('flags non-numeric metrics', () => {
            const result = validateMetricsData({ ...validReport, metrics: { cpu: 'fast' } }, echoMessages)

            expect(result.errors.metrics).toEqual(['error:metrics'])
        })
    })

    describe('multiple failures aggregate', () => {
        it('reports every invalid field at once', () => {
            const result = validateMetricsData({}, echoMessages)

            expect(result.success).toBe(false)
            expect(result.errors).toEqual({
                id: ['error:id'],
                status: ['error:status'],
                metrics: ['error:metrics'],
                created_at: ['error:created_at'],
                updated_at: ['error:updated_at'],
            })
        })

        it('reports only the fields that failed', () => {
            const result = validateMetricsData(
                { ...validReport, status: 'bogus', metrics: { a: 'b' } },
                echoMessages,
            )

            expect(result.errors).toEqual({
                status: ['error:status'],
                metrics: ['error:metrics'],
            })
            expect(result.errors.id).toBeUndefined()
        })
    })

    describe('early return for non-records', () => {
        it.each([
            [null],
            [undefined],
            [0],
            [42],
            [''],
            ['a string'],
            [true],
            [false],
            [[]],
            [[1, 2, 3]],
            [new Date()],
            [new Map()],
            [() => { }],
        ])('%o returns empty errors and success false', (input) => {
            const result = validateMetricsData(input, echoMessages)

            expect(result.success).toBe(false)
            expect(result.errors).toEqual({})
        })

        it('does not call getMessages at all', () => {
            const getMessages = vi.fn(echoMessages)

            validateMetricsData(null, getMessages)

            expect(getMessages).not.toHaveBeenCalled()
        })
    })

    describe('message injection', () => {
        it('calls getMessages once per failing field', () => {
            const getMessages = vi.fn(echoMessages)

            validateMetricsData({}, getMessages)

            expect(getMessages).toHaveBeenCalledTimes(5)
            for (const key of ['id', 'status', 'metrics', 'created_at', 'updated_at'] as const) {
                expect(getMessages).toHaveBeenCalledWith(key)
            }
        })

        it('does not call getMessages when validation passes', () => {
            const getMessages = vi.fn(echoMessages)

            validateMetricsData(validReport, getMessages)

            expect(getMessages).not.toHaveBeenCalled()
        })

        it('uses whatever array getMessages returns', () => {
            const getMessages = (key: keyof MetricsReport) => [`FR:${key}`, `FR:${key}:hint`]

            const result = validateMetricsData({}, getMessages)

            expect(result.errors.id).toEqual(['FR:id', 'FR:id:hint'])
        })
    })

    describe('success flag', () => {
        it('is true when every field validates', () => {
            expect(validateMetricsData(validReport, echoMessages).success).toBe(true)
        })

        it('is false when any field fails', () => {
            expect(validateMetricsData({ ...validReport, id: '' }, echoMessages).success).toBe(false)
        })

        it('is NOT the inverse of "errors is empty" for non-records', () => {
            // The early return gives empty errors AND success:false.
            // If a caller does `if (result.success) ... else render(result.errors)`,
            // non-record input renders nothing. Intentional or not, it's a contract.
            const result = validateMetricsData(null, echoMessages)

            expect(result.success).toBe(false)
            expect(Object.keys(result.errors)).toHaveLength(0)
        })
    })
})