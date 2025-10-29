import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TextInputPanelProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
    disabled?: boolean;
}

export const TextInputPanel = ({
    value,
    onChange,
    onClear,
    placeholder = 'Paste or type the text you want to summarize here...',
    disabled = false
}: TextInputPanelProps) => {
    const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
    const charCount = value.length;
    const maxWords = 5000;

    const isOverLimit = wordCount > maxWords;

    return (
        <Card className='h-full flex flex-col'>
            <CardHeader className='flex-shrink-0 pb-4'>
                <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                        <FileText className='h-5 w-5' />
                        Original Text Input
                    </CardTitle>
                    {value && (
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={onClear}
                            className='h-8 w-8 p-0'
                        >
                            <X className='h-4 w-4' />
                        </Button>
                    )}
                </div>

                <div className='flex items-center gap-2 text-sm'>
                    <Badge variant={isOverLimit ? 'destructive' : 'secondary'}>
                        {wordCount.toLocaleString()} words
                    </Badge>
                    <Badge variant='outline'>{charCount.toLocaleString()} characters</Badge>
                    {isOverLimit && (
                        <span className='text-destructive text-xs'>Exceeds {maxWords.toLocaleString()} word limit</span>
                    )}
                </div>
            </CardHeader>

            <CardContent className='flex-1 flex flex-col p-4 pt-0'>
                <Textarea
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className='flex-1 resize-none min-h-[200px] text-sm leading-relaxed'
                />

                {wordCount < 50 && wordCount > 0 && (
                    <div className='mt-2 text-xs text-muted-foreground'>
                        💡 Tip: For better results, try adding more text (at least 50 words recommended)
                    </div>
                )}

                {wordCount >= 50 && (
                    <div className='mt-2 text-xs text-muted-foreground'>✓ Good length for summarization</div>
                )}
            </CardContent>
        </Card>
    );
};
