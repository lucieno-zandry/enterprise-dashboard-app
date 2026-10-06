import { useState } from "react"
import { isValidationErrors, validateMetricsData } from "../utils/validate-value";
import type { MetricsReport } from "../data/models";
import type { ValidationErrors } from "../data/app-types";

const DEFAULT_STATE = {
    loading: false,
    errors: {} as ValidationErrors<MetricsReport>,
    isError: false,
    data: [] as MetricsReport[],
}

export const useFetchMetrics = (endpoint: string) => {
    const [state, setState] = useState(DEFAULT_STATE);

    const { errors, loading, isError, data } = state;

    const abortController = new AbortController();

    const fetchMetrics = async () => {
        // update loading state, remove errors
        setState({ ...DEFAULT_STATE, loading: true });

        // next state initialization
        const newState = { ...state };

        try {
            const response = await fetch(endpoint, { signal: abortController.signal });
            const data = await response.json();

            if (response.ok) {
                const validated = validateMetricsData(data);

                if (validated.success) {
                    newState.data = data;
                } else {
                    newState.errors = validated.errors;
                    newState.isError = true;
                }
            } else if (data.errors && isValidationErrors(data.errors)) {
                newState.errors = data.errors;
                newState.isError = true;
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return null;

        } finally {
            newState.loading = false;
            setState(newState);
        }
    }

    return {
        loading,
        fetch: fetchMetrics,
        errors,
        isError,
        data
    }
}