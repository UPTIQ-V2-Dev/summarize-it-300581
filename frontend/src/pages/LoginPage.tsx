import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { authService } from '@/services/auth';
import { isAuthenticated } from '@/lib/api';
import type { LoginRequest } from '@/types/user';

export const LoginPage = () => {
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<LoginRequest>>({});

    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: () => {
            toast.success('Login successful!');
            navigate('/summarize');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Login failed. Please try again.');
        }
    });

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginRequest> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        loginMutation.mutate(formData);
    };

    const handleInputChange = (field: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Redirect if already authenticated
    if (isAuthenticated()) {
        navigate('/summarize');
        return null;
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-background px-4'>
            <div className='w-full max-w-md'>
                <Card>
                    <CardHeader className='space-y-1'>
                        <CardTitle className='text-2xl text-center'>Sign In</CardTitle>
                        <CardDescription className='text-center'>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className='space-y-4'>
                            {loginMutation.error && (
                                <Alert variant='destructive'>
                                    <AlertDescription>
                                        {(loginMutation.error as any)?.response?.data?.message ||
                                            'An error occurred during login. Please try again.'}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className='space-y-2'>
                                <Label htmlFor='email'>Email</Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='Enter your email'
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    className={errors.email ? 'border-destructive' : ''}
                                    disabled={loginMutation.isPending}
                                />
                                {errors.email && <p className='text-sm text-destructive'>{errors.email}</p>}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='password'>Password</Label>
                                <div className='relative'>
                                    <Input
                                        id='password'
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Enter your password'
                                        value={formData.password}
                                        onChange={handleInputChange('password')}
                                        className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                                        disabled={loginMutation.isPending}
                                    />
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='sm'
                                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loginMutation.isPending}
                                    >
                                        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                                    </Button>
                                </div>
                                {errors.password && <p className='text-sm text-destructive'>{errors.password}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className='flex flex-col space-y-4'>
                            <Button
                                type='submit'
                                className='w-full'
                                disabled={loginMutation.isPending}
                            >
                                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                            </Button>

                            <div className='flex flex-col items-center space-y-2 text-sm'>
                                <Link
                                    to='/forgot-password'
                                    className='text-primary hover:underline'
                                >
                                    Forgot your password?
                                </Link>
                                <div className='text-muted-foreground'>
                                    Don't have an account?{' '}
                                    <Link
                                        to='/register'
                                        className='text-primary hover:underline'
                                    >
                                        Sign up
                                    </Link>
                                </div>
                                <div className='text-muted-foreground'>
                                    <Link
                                        to='/'
                                        className='text-primary hover:underline'
                                    >
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};
