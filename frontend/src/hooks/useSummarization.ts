import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    generateSummary,
    getSummaryHistory,
    saveSummaryToHistory,
    deleteSummaryFromHistory,
    getSummaryStats
} from '@/services/summaryApi';
import type { SummaryRequest, SummaryResponse, SummaryOptions } from '@/types/summary';

export const useSummarization = () => {
    return useMutation({
        mutationFn: (request: SummaryRequest) => generateSummary(request),
        onError: error => {
            console.error('Summarization failed:', error);
        }
    });
};

export const useSummaryHistory = () => {
    return useQuery({
        queryKey: ['summaryHistory'],
        queryFn: getSummaryHistory,
        staleTime: 1000 * 60 * 5
    });
};

export const useSaveSummary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            originalText,
            summaryData,
            options,
            title
        }: {
            originalText: string;
            summaryData: SummaryResponse;
            options: SummaryOptions;
            title: string;
        }) => saveSummaryToHistory(originalText, summaryData, options, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['summaryHistory'] });
            queryClient.invalidateQueries({ queryKey: ['summaryStats'] });
        }
    });
};

export const useDeleteSummary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteSummaryFromHistory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['summaryHistory'] });
            queryClient.invalidateQueries({ queryKey: ['summaryStats'] });
        }
    });
};

export const useSummaryStats = () => {
    return useQuery({
        queryKey: ['summaryStats'],
        queryFn: getSummaryStats,
        staleTime: 1000 * 60 * 10
    });
};
