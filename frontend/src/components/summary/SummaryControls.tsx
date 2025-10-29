import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Settings } from 'lucide-react';
import type { SummaryOptions } from '@/types/summary';

interface SummaryControlsProps {
    onGenerate: (options: SummaryOptions) => void;
    disabled?: boolean;
    isLoading?: boolean;
    hasText?: boolean;
}

export const SummaryControls = ({
    onGenerate,
    disabled = false,
    isLoading = false,
    hasText = false
}: SummaryControlsProps) => {
    const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
    const [style, setStyle] = useState<'bullet-points' | 'paragraph' | 'key-highlights'>('paragraph');
    const [extractKeywords, setExtractKeywords] = useState(true);

    const handleGenerate = () => {
        const options: SummaryOptions = {
            length,
            style,
            extractKeywords
        };
        onGenerate(options);
    };

    const isDisabled = disabled || isLoading || !hasText;

    return (
        <Card>
            <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-2 text-lg'>
                    <Settings className='h-5 w-5' />
                    Summary Options
                </CardTitle>
            </CardHeader>

            <CardContent className='space-y-6'>
                <div className='grid gap-4'>
                    <div className='space-y-2'>
                        <Label
                            htmlFor='length-select'
                            className='text-sm font-medium'
                        >
                            Summary Length
                        </Label>
                        <Select
                            value={length}
                            onValueChange={(value: any) => setLength(value)}
                        >
                            <SelectTrigger id='length-select'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='short'>
                                    <div className='flex flex-col'>
                                        <span>Short</span>
                                        <span className='text-xs text-muted-foreground'>
                                            Quick overview (~15% of original)
                                        </span>
                                    </div>
                                </SelectItem>
                                <SelectItem value='medium'>
                                    <div className='flex flex-col'>
                                        <span>Medium</span>
                                        <span className='text-xs text-muted-foreground'>
                                            Balanced summary (~25% of original)
                                        </span>
                                    </div>
                                </SelectItem>
                                <SelectItem value='long'>
                                    <div className='flex flex-col'>
                                        <span>Long</span>
                                        <span className='text-xs text-muted-foreground'>
                                            Detailed summary (~40% of original)
                                        </span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-2'>
                        <Label
                            htmlFor='style-select'
                            className='text-sm font-medium'
                        >
                            Summary Style
                        </Label>
                        <Select
                            value={style}
                            onValueChange={(value: any) => setStyle(value)}
                        >
                            <SelectTrigger id='style-select'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='paragraph'>
                                    <div className='flex flex-col'>
                                        <span>Paragraph</span>
                                        <span className='text-xs text-muted-foreground'>Flowing text format</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value='bullet-points'>
                                    <div className='flex flex-col'>
                                        <span>Bullet Points</span>
                                        <span className='text-xs text-muted-foreground'>Key points listed</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value='key-highlights'>
                                    <div className='flex flex-col'>
                                        <span>Key Highlights</span>
                                        <span className='text-xs text-muted-foreground'>Structured with icons</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator />

                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                            <Label
                                htmlFor='keywords-switch'
                                className='text-sm font-medium'
                            >
                                Extract Keywords
                            </Label>
                            <p className='text-xs text-muted-foreground'>Include relevant keywords and topics</p>
                        </div>
                        <Switch
                            id='keywords-switch'
                            checked={extractKeywords}
                            onCheckedChange={setExtractKeywords}
                        />
                    </div>
                </div>

                <Separator />

                <Button
                    onClick={handleGenerate}
                    disabled={isDisabled}
                    className='w-full'
                    size='lg'
                >
                    <Sparkles className='h-4 w-4 mr-2' />
                    {isLoading ? 'Generating...' : 'Generate Summary'}
                </Button>

                {!hasText && (
                    <p className='text-xs text-muted-foreground text-center'>Enter some text to generate a summary</p>
                )}
            </CardContent>
        </Card>
    );
};
