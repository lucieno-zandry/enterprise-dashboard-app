export type MetricsReport = {
    id: string;
    status: 'active' | 'archived' | 'failed';
    metrics: Record<string, number>;
    created_at: ISOString;
    updated_at: ISOString;
}

export type ISOString = string;