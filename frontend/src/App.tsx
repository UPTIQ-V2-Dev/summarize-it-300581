import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/hooks/useTheme';
import { LandingPage } from '@/pages/LandingPage';
import { SummaryToolPage } from '@/pages/SummaryToolPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1
        },
        mutations: {
            retry: 1
        }
    }
});

export const App = () => {
    return (
        <ThemeProvider
            defaultTheme='system'
            storageKey='vite-ui-theme'
        >
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <div className='min-h-screen bg-background text-foreground'>
                        <Routes>
                            <Route
                                path='/'
                                element={<LandingPage />}
                            />
                            <Route
                                path='/summarize'
                                element={<SummaryToolPage />}
                            />
                        </Routes>
                        <Toaster
                            richColors
                            position='top-right'
                        />
                    </div>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
};
