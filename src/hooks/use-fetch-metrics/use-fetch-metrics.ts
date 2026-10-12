import { useEffect, useRef, useState, type RefObject } from "react";
import type { MetricsReport } from "../../data/models";
import type { ValidationErrors } from "../../data/app-types";
import { validateMetricsData } from "../../utils/validate-metrics-data/validate-metrics-data";
import { isValidationErrors } from "../../utils/is-validation-errors/is-validation-errors";
import { getFetchMetricsMessage, type GetFetchMetricsMessage } from "../../utils/get-fetch-metrics-message";


const DEFAULT_STATE = {
    loading: false,
    errors: {} as {
        name?: string,
        message?: string,
        fields?: ValidationErrors<MetricsReport>,
        data?: unknown,
    },
    isError: false,
    data: null as MetricsReport | null,
}

const setError = (state: typeof DEFAULT_STATE, name: string, message: string, fields?: ValidationErrors, data?: unknown) => {
    state.isError = true;
    state.errors.name = name;
    state.errors.message = message;
    state.errors.fields = fields;
    state.errors.data = data;
}

export const useFetchMetrics = (endpoint: string, getMessage: GetFetchMetricsMessage = getFetchMetricsMessage) => {
    const [state, setState] = useState(DEFAULT_STATE);

    const abortRef: RefObject<AbortController | null> = useRef(null);

    const { errors, loading, isError, data } = state;

    const fetchMetrics = async () => {
        abortRef.current?.abort();

        // update loading state, remove errors
        setState({ ...DEFAULT_STATE, errors: {}, loading: true });

        const controller = new AbortController();
        abortRef.current = controller;

        let skipFinalSetState = false;

        const nextState: typeof DEFAULT_STATE = {
            errors: {},
            data: null,
            isError: false,
            loading: false
        };

        try {
            const response = await fetch(endpoint, { signal: controller.signal });
            const jsonResponse = await response.json();

            if (response.ok) {
                const validated = validateMetricsData(jsonResponse);

                if (validated.success) {
                    nextState.data = jsonResponse;
                } else {
                    setError(nextState, 'ParseError', getMessage('parse'), validated.errors, jsonResponse);
                }
            } else {
                if (isValidationErrors(jsonResponse.errors)) {
                    setError(nextState, 'ValidationError', getMessage('field'), jsonResponse.errors);
                    return;
                }

                setError(nextState, response.status + " Error", getMessage(response.status.toString()), undefined, response.body);
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                skipFinalSetState = true;
                return;
            };

            nextState.isError = true;
            console.error(error);

            if (!(error instanceof Error)) {
                setError(nextState, 'Unknown Error', 'An unknown error has occurred.', undefined, error);
                return;
            };

            if (error.name === "SyntaxError") {
                setError(nextState, "SyntaxError", getMessage('syntax'), undefined, error);
                return;
            }

            setError(nextState, error.name, getMessage('unknown'), undefined, error);
        } finally {
            if (abortRef.current !== controller) skipFinalSetState = true;

            if (!skipFinalSetState)
                setState(nextState);
        }
    }

    useEffect(() => {
        return () => {
            abortRef.current?.abort();
        }
    }, []);

    return {
        loading,
        fetchMetrics,
        errors,
        isError,
        data
    }
}