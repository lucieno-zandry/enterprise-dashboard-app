import { describe, expect, it } from "vitest";
import { isMetricStatus } from "./is-metric-status";

describe('isMetricStatus', () => {
    it.each([
        'archived',
        'active',
        'failed',
    ])('returns TRUE for metric status values', (value) => {
        expect(isMetricStatus(value)).toBe(true);
    });

    it.each([
        'archivd',
        12,
        false,
    ])('returns FALSE for non-metric values', (value) => {
        expect(isMetricStatus(value)).toBe(false);
    });
})