import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, Save, Sparkles } from 'lucide-react';
import { useClipboard } from '@/hooks/useClipboard';
import type { SummaryResponse } from '@/types/summary';

interface SummaryOutputPanelProps {
    summaryData?: SummaryResponse;
    onSave?: () => void;
    onExport?: () => void;
    isLoading?: boolean;
}

export const SummaryOutputPanel = ({ summaryData, onSave, onExport, isLoading = false }: SummaryOutputPanelProps) => {
    const { copied, copyToClipboard } = useClipboard();

    const handleCopy = () => {
        if (summaryData?.summary) {
            copyToClipboard(summaryData.summary);
        }
    };

    if (isLoading) {
        return (
            <Card className='h-full flex flex-col'>
                <CardHeader className='flex-shrink-0'>
                    <CardTitle className='flex items-center gap-2'>
                        <Sparkles className='h-5 w-5 animate-pulse' />
                        Generating Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex-1 flex items-center justify-center p-4'>
                    <div className='text-center space-y-4'>
                        <div className='animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto' />
                        <p className='text-muted-foreground'>Processing your text and generating summary...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!summaryData) {
        return (
            <Card className='h-full flex flex-col'>
                <CardHeader className='flex-shrink-0'>
                    <CardTitle className='flex items-center gap-2'>
                        <Sparkles className='h-5 w-5' />
                        Generated Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className='flex-1 flex items-center justify-center p-4'>
                    <div className='text-center space-y-2'>
                        <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto'>
                            <Sparkles className='h-8 w-8 text-muted-foreground' />
                        </div>
                        <p className='text-muted-foreground'>The generated summary will appear here...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const compressionPercentage = Math.round((1 - 1 / summaryData.metadata.compressionRatio) * 100);

    return (
        <Card className='h-full flex flex-col'>
            <CardHeader className='flex-shrink-0'>
                <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                        <Sparkles className='h-5 w-5 text-primary' />
                        Generated Summary
                    </CardTitle>
                    <div className='flex gap-2'>
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={handleCopy}
                            disabled={!summaryData.summary}
                        >
                            <Copy className='h-4 w-4 mr-1' />
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        {onSave && (
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={onSave}
                            >
                                <Save className='h-4 w-4 mr-1' />
                                Save
                            </Button>
                        )}
                        {onExport && (
                            <Button
                                variant='ghost'
                                size='sm'
                                onClick={onExport}
                            >
                                <Download className='h-4 w-4 mr-1' />
                                Export
                            </Button>
                        )}
                    </div>
                </div>

                <div className='flex items-center gap-2 text-sm'>
                    <Badge variant='secondary'>{summaryData.wordCount} words</Badge>
                    <Badge variant='outline'>{compressionPercentage}% shorter</Badge>
                    <Badge variant='outline'>{(summaryData.processingTime / 1000).toFixed(1)}s</Badge>
                </div>
            </CardHeader>

            <CardContent className='flex-1 flex flex-col p-4 pt-0'>
                <div className='flex-1 bg-muted/50 rounded-lg p-4 overflow-auto'>
                    <div className='prose prose-sm max-w-none dark:prose-invert'>
                        {summaryData.summary.split('\n').map((paragraph, index) => (
                            <div
                                key={index}
                                className='mb-3 last:mb-0'
                            >
                                {paragraph.trim() && <p className='leading-relaxed'>{paragraph}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                {summaryData.keywords && summaryData.keywords.length > 0 && (
                    <>
                        <Separator className='my-4' />
                        <div className='space-y-2'>
                            <h4 className='text-sm font-medium'>Key Topics</h4>
                            <div className='flex flex-wrap gap-1'>
                                {summaryData.keywords.map((keyword, index) => (
                                    <Badge
                                        key={index}
                                        variant='outline'
                                        className='text-xs'
                                    >
                                        {keyword}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <Separator className='my-4' />
                <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                        <span className='text-muted-foreground'>Original:</span>
                        <span className='ml-2 font-medium'>
                            {summaryData.metadata.originalWordCount.toLocaleString()} words
                        </span>
                    </div>
                    <div>
                        <span className='text-muted-foreground'>Compression:</span>
                        <span className='ml-2 font-medium'>{summaryData.metadata.compressionRatio.toFixed(1)}x</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
