import { Suspense } from 'react';
import { LoginForm } from '@/components/custom/login-form'

const LoginContent = async (props: { searchParams: Promise<{ redirect?: string }> }) => {
    const searchParams = await props.searchParams;
    return <LoginForm redirectTo={searchParams?.redirect} />;
}

const LoginPage = (props: { searchParams: Promise<{ redirect?: string }> }) => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Suspense fallback={<div className="flex items-center justify-center"><div className="animate-pulse">Loading...</div></div>}>
                    <LoginContent searchParams={props.searchParams} />
                </Suspense>
            </div>
        </div>
    )
}

export default LoginPage