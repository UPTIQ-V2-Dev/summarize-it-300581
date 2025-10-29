export interface SummaryOptions {
    length: 'short' | 'medium' | 'long';
    style: 'bullet-points' | 'paragraph' | 'key-highlights';
    extractKeywords: boolean;
}

export interface SummaryRequest {
    text: string;
    options?: SummaryOptions;
}

export interface SummaryResponse {
    summary: string;
    wordCount: number;
    keywords?: string[];
    processingTime: number;
    metadata: {
        originalWordCount: number;
        compressionRatio: number;
        confidence: number;
    };
}

export interface SummaryHistoryItem {
    id: string;
    originalText: string;
    summary: string;
    options: SummaryOptions;
    createdAt: string;
    wordCount: number;
    title: string;
}

export interface SummaryStats {
    totalSummaries: number;
    totalWordsSummarized: number;
    averageCompressionRatio: number;
}
