import { summaryService } from '../services/index.ts';
import { MCPTool } from '../types/mcp.ts';
import { z } from 'zod';

const summarySchema = z.object({
    id: z.number(),
    title: z.string(),
    originalText: z.string(),
    summaryText: z.string(),
    options: z.string(),
    wordCount: z.number(),
    originalWordCount: z.number(),
    compressionRatio: z.number(),
    confidence: z.number(),
    keywords: z.string().nullable(),
    processingTime: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.number()
});

const processSummarizationTool: MCPTool = {
    id: 'summary_process',
    name: 'Process Text Summarization',
    description: 'Generate a summary from provided text with optional parameters',
    inputSchema: z.object({
        text: z.string().min(10),
        options: z
            .object({
                length: z.enum(['short', 'medium', 'long']).optional(),
                style: z.enum(['paragraph', 'bullet', 'outline']).optional(),
                extractKeywords: z.boolean().optional()
            })
            .optional()
    }),
    outputSchema: z.object({
        summary: z.string(),
        wordCount: z.number(),
        keywords: z.array(z.string()).optional(),
        processingTime: z.number(),
        metadata: z.object({
            originalWordCount: z.number(),
            compressionRatio: z.number(),
            confidence: z.number()
        })
    }),
    fn: (inputs: { text: string; options?: { length?: string; style?: string; extractKeywords?: boolean } }) => {
        const result = summaryService.processSummarization(inputs.text, inputs.options || {});
        return result;
    }
};

const createSummaryTool: MCPTool = {
    id: 'summary_create',
    name: 'Create Summary Record',
    description: 'Create a new summary record in the database',
    inputSchema: z.object({
        title: z.string(),
        originalText: z.string(),
        summaryText: z.string(),
        options: z.string(),
        wordCount: z.number().int(),
        originalWordCount: z.number().int(),
        compressionRatio: z.number(),
        confidence: z.number(),
        keywords: z.string().optional(),
        processingTime: z.number().int(),
        userId: z.number().int()
    }),
    outputSchema: summarySchema,
    fn: async (inputs: {
        title: string;
        originalText: string;
        summaryText: string;
        options: string;
        wordCount: number;
        originalWordCount: number;
        compressionRatio: number;
        confidence: number;
        keywords?: string;
        processingTime: number;
        userId: number;
    }) => {
        const summary = await summaryService.createSummary(inputs);
        return summary;
    }
};

const getSummariesTool: MCPTool = {
    id: 'summary_get_all',
    name: 'Get All Summaries',
    description: 'Get all summaries with optional filters and pagination',
    inputSchema: z.object({
        userId: z.number().int().optional(),
        limit: z.number().int().optional(),
        page: z.number().int().optional(),
        sortBy: z.string().optional(),
        sortType: z.enum(['asc', 'desc']).optional()
    }),
    outputSchema: z.object({
        summaries: z.array(summarySchema)
    }),
    fn: async (inputs: {
        userId?: number;
        limit?: number;
        page?: number;
        sortBy?: string;
        sortType?: 'asc' | 'desc';
    }) => {
        const filter = inputs.userId ? { userId: inputs.userId } : {};
        const options = {
            limit: inputs.limit,
            page: inputs.page,
            sortBy: inputs.sortBy,
            sortType: inputs.sortType
        };
        const result = await summaryService.querySummaries(filter, options);
        return { summaries: result };
    }
};

const getSummaryTool: MCPTool = {
    id: 'summary_get_by_id',
    name: 'Get Summary By ID',
    description: 'Get a single summary by its ID',
    inputSchema: z.object({
        summaryId: z.number().int()
    }),
    outputSchema: summarySchema,
    fn: async (inputs: { summaryId: number }) => {
        const summary = await summaryService.getSummaryById(inputs.summaryId);
        if (!summary) {
            throw new Error('Summary not found');
        }
        return summary;
    }
};

const updateSummaryTool: MCPTool = {
    id: 'summary_update',
    name: 'Update Summary',
    description: 'Update summary information by ID',
    inputSchema: z.object({
        summaryId: z.number().int(),
        title: z.string().optional(),
        originalText: z.string().optional(),
        summaryText: z.string().optional(),
        options: z.string().optional(),
        wordCount: z.number().int().optional(),
        originalWordCount: z.number().int().optional(),
        compressionRatio: z.number().optional(),
        confidence: z.number().optional(),
        keywords: z.string().optional(),
        processingTime: z.number().int().optional()
    }),
    outputSchema: summarySchema,
    fn: async (inputs: {
        summaryId: number;
        title?: string;
        originalText?: string;
        summaryText?: string;
        options?: string;
        wordCount?: number;
        originalWordCount?: number;
        compressionRatio?: number;
        confidence?: number;
        keywords?: string;
        processingTime?: number;
    }) => {
        const { summaryId, ...updateBody } = inputs;
        const summary = await summaryService.updateSummaryById(summaryId, updateBody);
        return summary;
    }
};

const deleteSummaryTool: MCPTool = {
    id: 'summary_delete',
    name: 'Delete Summary',
    description: 'Delete a summary by its ID',
    inputSchema: z.object({
        summaryId: z.number().int()
    }),
    outputSchema: z.object({
        success: z.boolean()
    }),
    fn: async (inputs: { summaryId: number }) => {
        await summaryService.deleteSummaryById(inputs.summaryId);
        return { success: true };
    }
};

const getUserSummaryStatsTool: MCPTool = {
    id: 'summary_get_user_stats',
    name: 'Get User Summary Statistics',
    description: "Get statistics about a user's summarization activity",
    inputSchema: z.object({
        userId: z.number().int()
    }),
    outputSchema: z.object({
        totalSummaries: z.number(),
        totalWordsSummarized: z.number(),
        averageCompressionRatio: z.number()
    }),
    fn: async (inputs: { userId: number }) => {
        const stats = await summaryService.getUserSummaryStats(inputs.userId);
        return stats;
    }
};

export const summaryTools: MCPTool[] = [
    processSummarizationTool,
    createSummaryTool,
    getSummariesTool,
    getSummaryTool,
    updateSummaryTool,
    deleteSummaryTool,
    getUserSummaryStatsTool
];
