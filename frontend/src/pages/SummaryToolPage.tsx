import { useState } from 'react';
import { TextInputPanel } from '@/components/summary/TextInputPanel';
import { SummaryOutputPanel } from '@/components/summary/SummaryOutputPanel';
import { SummaryControls } from '@/components/summary/SummaryControls';
import { useSummarization, useSaveSummary } from '@/hooks/useSummarization';
import { toast } from 'sonner';
import type { SummaryOptions, SummaryResponse } from '@/types/summary';

export const SummaryToolPage = () => {
    const [inputText, setInputText] = useState('');
    const [summaryData, setSummaryData] = useState<SummaryResponse | undefined>();

    const summarizeMutation = useSummarization();
    const saveSummaryMutation = useSaveSummary();

    const handleGenerateSummary = (options: SummaryOptions) => {
        if (!inputText.trim()) {
            toast.error('Please enter some text to summarize');
            return;
        }

        const wordCount = inputText.trim().split(/\s+/).length;
        if (wordCount > 5000) {
            toast.error('Text is too long. Please limit to 5,000 words or less.');
            return;
        }

        summarizeMutation.mutate(
            { text: inputText, options },
            {
                onSuccess: data => {
                    setSummaryData(data);
                    toast.success('Summary generated successfully!');
                },
                onError: error => {
                    console.error('Summarization failed:', error);
                    toast.error('Failed to generate summary. Please try again.');
                }
            }
        );
    };

    const handleClearInput = () => {
        setInputText('');
        setSummaryData(undefined);
    };

    const handleSaveSummary = () => {
        if (!summaryData || !inputText) {
            toast.error('No summary to save');
            return;
        }

        const title = inputText.slice(0, 50) + (inputText.length > 50 ? '...' : '');

        saveSummaryMutation.mutate(
            {
                originalText: inputText,
                summaryData,
                options: summarizeMutation.variables?.options || {
                    length: 'medium',
                    style: 'paragraph',
                    extractKeywords: true
                },
                title
            },
            {
                onSuccess: () => {
                    toast.success('Summary saved to history!');
                },
                onError: () => {
                    toast.error('Failed to save summary');
                }
            }
        );
    };

    const handleExportSummary = () => {
        if (!summaryData) {
            toast.error('No summary to export');
            return;
        }

        const exportText = `# Summary\n\n${summaryData.summary}\n\n---\n\n**Stats:**\n- Original: ${summaryData.metadata.originalWordCount} words\n- Summary: ${summaryData.wordCount} words\n- Compression: ${summaryData.metadata.compressionRatio.toFixed(1)}x\n- Processing time: ${(summaryData.processingTime / 1000).toFixed(1)}s`;

        const blob = new Blob([exportText], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'summary.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Summary exported as Markdown file!');
    };

    return (
        <div className='min-h-screen bg-background'>
            <div className='container mx-auto px-4 py-6'>
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-6rem)]'>
                    <div className='lg:col-span-3'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 h-full'>
                            <TextInputPanel
                                value={inputText}
                                onChange={setInputText}
                                onClear={handleClearInput}
                                disabled={summarizeMutation.isPending}
                            />

                            <SummaryOutputPanel
                                summaryData={summaryData}
                                onSave={handleSaveSummary}
                                onExport={handleExportSummary}
                                isLoading={summarizeMutation.isPending}
                            />
                        </div>
                    </div>

                    <div className='lg:col-span-1'>
                        <SummaryControls
                            onGenerate={handleGenerateSummary}
                            disabled={!inputText.trim()}
                            isLoading={summarizeMutation.isPending}
                            hasText={!!inputText.trim()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
