import type { SummaryResponse, SummaryHistoryItem, SummaryOptions } from '@/types/summary';

const createMockSummary = (text: string, options?: SummaryOptions): SummaryResponse => {
    const words = text.trim().split(/\s+/);
    const originalWordCount = words.length;
    const summaryLength = options?.length || 'medium';

    let summary: string;

    switch (summaryLength) {
        case 'short':
            summary = generateShortSummary(text, options?.style);
            break;
        case 'long':
            summary = generateLongSummary(text, options?.style);
            break;
        default:
            summary = generateMediumSummary(text, options?.style);
    }

    const summaryWordCount = summary.trim().split(/\s+/).length;
    const compressionRatio = originalWordCount / summaryWordCount;

    const keywords = options?.extractKeywords ? generateKeywords(text) : undefined;

    return {
        summary,
        wordCount: summaryWordCount,
        keywords,
        processingTime: Math.random() * 2000 + 500,
        metadata: {
            originalWordCount,
            compressionRatio: Math.round(compressionRatio * 100) / 100,
            confidence: Math.random() * 0.3 + 0.7
        }
    };
};

const generateShortSummary = (text: string, style?: string): string => {
    switch (style) {
        case 'bullet-points':
            return '• Main concept identified and analyzed\n• Key findings summarized concisely\n• Important conclusions highlighted';
        case 'key-highlights':
            return '🔍 Key Insights: Essential points extracted and distilled into core concepts for quick understanding.';
        default:
            return 'This text discusses key concepts and presents important information in a structured manner. The main points are clearly outlined and provide valuable insights for the reader.';
    }
};

const generateMediumSummary = (text: string, style?: string): string => {
    switch (style) {
        case 'bullet-points':
            return `• The provided text contains detailed information on the specified topic
• Key arguments and supporting evidence are presented systematically
• Multiple perspectives and viewpoints are considered throughout
• Practical implications and real-world applications are discussed
• Conclusions are drawn based on the comprehensive analysis provided`;
        case 'key-highlights':
            return `🎯 Main Focus: The content explores important themes and concepts in depth.

📊 Key Data: Significant findings and evidence support the central arguments.

💡 Insights: Multiple perspectives provide a well-rounded understanding of the subject matter.`;
        default:
            return `The provided text presents a comprehensive analysis of the topic, exploring various aspects and perspectives. Key arguments are supported by relevant evidence, and the discussion includes practical implications. The content offers valuable insights and draws meaningful conclusions based on the information presented.`;
    }
};

const generateLongSummary = (text: string, style?: string): string => {
    switch (style) {
        case 'bullet-points':
            return `• Introduction establishes the context and scope of the discussion
• Background information provides necessary foundation for understanding
• Main arguments are systematically presented with supporting evidence
• Multiple perspectives and viewpoints are thoroughly examined
• Counterarguments and alternative interpretations are acknowledged
• Practical applications and real-world implications are explored
• Supporting data and examples strengthen the overall presentation
• Limitations and potential areas for further research are identified
• Conclusions synthesize key findings and highlight important takeaways
• Future directions and recommendations are provided for consideration`;
        case 'key-highlights':
            return `🎯 Primary Objectives: The text establishes clear goals and outlines the comprehensive scope of analysis.

📋 Context & Background: Essential foundation information is provided to ensure proper understanding.

🔍 Core Arguments: Multiple well-supported arguments are presented with detailed evidence and examples.

⚖️ Different Perspectives: Various viewpoints are examined to provide balanced coverage of the topic.

📊 Supporting Evidence: Relevant data, statistics, and case studies reinforce the main points discussed.

🎯 Practical Applications: Real-world implications and potential uses are thoroughly explored.

📈 Key Findings: Significant discoveries and insights emerge from the comprehensive analysis.

🚀 Future Directions: Recommendations and next steps are outlined for continued development.`;
        default:
            return `The document provides an extensive exploration of the subject matter, beginning with essential background context and establishing clear objectives. The analysis systematically examines multiple perspectives, presenting well-supported arguments backed by relevant evidence and practical examples.

Throughout the discussion, various viewpoints are considered to ensure comprehensive coverage, while acknowledging potential limitations and alternative interpretations. The content demonstrates practical applications and real-world implications, making the information accessible and applicable.

Key findings are synthesized to highlight the most important insights, and the analysis concludes with recommendations for future consideration and areas that warrant further investigation. This thorough approach ensures readers gain a complete understanding of the topic and its broader significance.`;
    }
};

const generateKeywords = (text: string): string[] => {
    const commonKeywords = [
        'analysis',
        'research',
        'development',
        'implementation',
        'strategy',
        'methodology',
        'framework',
        'approach',
        'solutions',
        'insights',
        'findings',
        'results',
        'conclusions',
        'recommendations',
        'optimization'
    ];

    return commonKeywords.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 3);
};

export const mockSummaryHistory: SummaryHistoryItem[] = [
    {
        id: '1',
        title: 'Product Strategy Document',
        originalText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
        summary: 'Product strategy outlines key objectives and market positioning.',
        options: { length: 'medium', style: 'paragraph', extractKeywords: true },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        wordCount: 45
    },
    {
        id: '2',
        title: 'Research Paper Analysis',
        originalText: 'Scientific research demonstrates significant findings...',
        summary: 'Research reveals important insights about environmental factors.',
        options: { length: 'short', style: 'bullet-points', extractKeywords: false },
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        wordCount: 32
    }
];

export { createMockSummary };
