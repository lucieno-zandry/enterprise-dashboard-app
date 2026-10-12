import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchMetrics } from "./use-fetch-metrics";
import { renderHook } from "@testing-library/react";
import { act } from "react";

const okResponse = (body: unknown) => {
    Promise.resolve({
        ok: true,
        status: 200,
        body: null,
        json: () => Promise.resolve(body)
    } as Response);
}

beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
    vi.unstubAllGlobals();
});

const validReport = {
    id: 'rpt_123',
    status: 'active',
    metrics: { cpu: 0.5, memory: 0.8 },
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-02T00:00:00.000Z',
}


describe('useFetchMetrics', () => {
    it('starts in an idle state', () => {
        const { result } = renderHook(() => useFetchMetrics('/api'));

        expect(result.current.loading).toBeFalsy();
        expect(result.current.errors).toEqual({});
        expect(typeof result.current.fetchMetrics).toBe('function');
        expect(result.current.data).toBeNull;
        expect(result.current.isError).toBe(false);
    })


    it('Formats data correctly and clears loading', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            body: null,
            json: () => Promise.resolve(validReport)
        }))

        const { result } = renderHook(() => useFetchMetrics('/api'))

        await act(async () => await result.current.fetchMetrics());

        expect(result.current.data).toEqual(validReport);
        expect(result.current.errors).toEqual({});
        expect(result.current.isError).toBe(false);
        expect(result.current.loading).toBe(false);
    });

    it('Formats errors for rejected fetch and set isErrors to TRUE ', async () => {

        const errorBody = {
            message: "Internal Server Error",
            name: "Internal Server Error",
            errors: {
                id: ['required']
            }
        };

        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 422,
            body: null,
            json: () => Promise.resolve(errorBody)
        }))

        const { result } = renderHook(() => useFetchMetrics('/api'));

        await act(async () => await result.current.fetchMetrics());

        expect(result.current.data).toEqual(null);
        expect(result.current.isError).toBe(true);
        expect(result.current.loading).toBe(false);
        expect(result.current.errors.name).toBe('ValidationError');
        expect(result.current.errors.fields).toEqual(errorBody.errors);
    })


    it('aborts the request when the component unmounts', async () => {
        let signalRef: AbortSignal | undefined

        vi.stubGlobal(
            'fetch',
            vi.fn().mockImplementation((_url, init: RequestInit) => {
                signalRef = init.signal ?? undefined
                // Return a promise that rejects when the signal aborts.
                return new Promise((_resolve, reject) => {
                    signalRef?.addEventListener('abort', () =>
                        reject(new DOMException('Aborted', 'AbortError')),
                    )
                })
            }),
        )

        const { result, unmount } = renderHook(() => useFetchMetrics('/api'))

        // Start the fetch but don't await it — it hangs forever.
        let pending: Promise<void>
        await act(async () => {
            pending = result.current.fetchMetrics()
        })

        expect(signalRef?.aborted).toBe(false)

        unmount()
        await act(async () => { await pending! })

        expect(signalRef?.aborted).toBe(true)
    })
})


