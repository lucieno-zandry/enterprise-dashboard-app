const ERRORS = {
    'field': 'Some fields are invalid.',
    'syntax': 'A Syntax Error occured',
    'parse': 'Failed to parse metrics',
}

export type GetFetchMetricsMessage = (key: string, errors?: Record<string, string>) => string

export const getFetchMetricsMessage = (key: string, errors: Record<string, string> = ERRORS) => {
    return errors[key] || `Unknown error : ${key}`;
}