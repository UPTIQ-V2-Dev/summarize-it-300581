import { api } from '@/lib/api';
import type { SummaryRequest, SummaryResponse, SummaryHistoryItem, SummaryStats } from '@/types/summary';
import { createMockSummary, mockSummaryHistory } from '@/data/summaryMockData';

export const generateSummary = async (request: SummaryRequest): Promise<SummaryResponse> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        return createMockSummary(request.text, request.options);
    }

    const response = await api.post<SummaryResponse>('/api/summarize', request);
    return response.data;
};

export const getSummaryHistory = async (): Promise<SummaryHistoryItem[]> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockSummaryHistory;
    }

    const response = await api.get<SummaryHistoryItem[]>('/api/history');
    return response.data;
};

export const saveSummaryToHistory = async (
    originalText: string,
    summaryData: SummaryResponse,
    options: any,
    title: string
): Promise<SummaryHistoryItem> => {
    const historyItem = {
        originalText,
        summary: summaryData.summary,
        options,
        title,
        wordCount: summaryData.wordCount
    };

    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            id: Date.now().toString(),
            ...historyItem,
            createdAt: new Date().toISOString()
        };
    }

    const response = await api.post<SummaryHistoryItem>('/api/history', historyItem);
    return response.data;
};

export const deleteSummaryFromHistory = async (id: string): Promise<void> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        await new Promise(resolve => setTimeout(resolve, 200));
        return;
    }

    await api.delete(`/api/history/${id}`);
};

export const getSummaryStats = async (): Promise<SummaryStats> => {
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        await new Promise(resolve => setTimeout(resolve, 300));
        return {
            totalSummaries: 24,
            totalWordsSummarized: 12450,
            averageCompressionRatio: 3.2
        };
    }

    const response = await api.get<SummaryStats>('/api/stats');
    return response.data;
};
