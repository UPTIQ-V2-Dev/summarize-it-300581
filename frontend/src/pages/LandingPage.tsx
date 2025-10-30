import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ArrowRight, FileText, Sparkles, Zap, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
    const features = [
        {
            icon: <Sparkles className='h-6 w-6' />,
            title: 'AI-Powered Summaries',
            description: 'Advanced algorithms extract key insights from your text automatically'
        },
        {
            icon: <Zap className='h-6 w-6' />,
            title: 'Multiple Styles',
            description: 'Choose from paragraphs, bullet points, or structured highlights'
        },
        {
            icon: <Clock className='h-6 w-6' />,
            title: 'Lightning Fast',
            description: 'Get comprehensive summaries in seconds, not minutes'
        },
        {
            icon: <Target className='h-6 w-6' />,
            title: 'Customizable Length',
            description: 'Short overviews or detailed summaries - you choose the depth'
        }
    ];

    return (
        <div className='min-h-screen bg-background'>
            <header className='container mx-auto px-4 py-4'>
                <div className='flex justify-end'>
                    <ThemeToggle />
                </div>
            </header>
            <div className='container mx-auto px-4'>
                <section className='py-16 lg:py-24 text-center'>
                    <div className='max-w-3xl mx-auto space-y-6'>
                        <Badge
                            variant='secondary'
                            className='mb-4'
                        >
                            ✨ AI Summary Tool
                        </Badge>

                        <h1 className='text-4xl lg:text-6xl font-bold tracking-tight'>
                            Transform Long Text into
                            <span className='text-primary block'>Clear Summaries</span>
                        </h1>

                        <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
                            Save time and focus on what matters. Our AI-powered tool extracts key insights from lengthy
                            documents, articles, and reports in seconds.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center mt-8'>
                            <Button
                                asChild
                                size='lg'
                                className='text-lg px-8'
                            >
                                <Link to='/summarize'>
                                    Get Started <ArrowRight className='ml-2 h-5 w-5' />
                                </Link>
                            </Button>
                            <Button
                                variant='outline'
                                size='lg'
                                className='text-lg px-8'
                            >
                                <FileText className='mr-2 h-5 w-5' />
                                View Demo
                            </Button>
                        </div>
                    </div>
                </section>

                <section className='py-16'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='text-center mb-12'>
                            <h2 className='text-3xl font-bold mb-4'>Why Choose Our Summary Tool?</h2>
                            <p className='text-muted-foreground max-w-2xl mx-auto'>
                                Designed for professionals, students, and researchers who need to process information
                                quickly and efficiently.
                            </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                            {features.map((feature, index) => (
                                <Card
                                    key={index}
                                    className='text-center p-6'
                                >
                                    <CardContent className='space-y-4'>
                                        <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto text-primary'>
                                            {feature.icon}
                                        </div>
                                        <h3 className='font-semibold'>{feature.title}</h3>
                                        <p className='text-sm text-muted-foreground'>{feature.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <section className='py-16 bg-muted/50 rounded-2xl mb-16'>
                    <div className='max-w-4xl mx-auto text-center px-6'>
                        <h2 className='text-3xl font-bold mb-4'>Ready to Summarize Your Content?</h2>
                        <p className='text-muted-foreground mb-8 text-lg'>
                            Join thousands of users who save hours every week with intelligent text summarization.
                        </p>
                        <Button
                            asChild
                            size='lg'
                            className='text-lg px-8'
                        >
                            <Link to='/summarize'>
                                Start Summarizing Now <ArrowRight className='ml-2 h-5 w-5' />
                            </Link>
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
};
