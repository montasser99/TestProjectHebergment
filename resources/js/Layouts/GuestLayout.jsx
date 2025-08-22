import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
            
            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#ffffff',
                        color: '#111827',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                    success: {
                        duration: 4000,
                        style: {
                            background: '#dcfce7',
                            color: '#166534',
                            border: '1px solid #16a34a',
                        },
                        iconTheme: {
                            primary: '#16a34a',
                            secondary: '#dcfce7',
                        },
                    },
                    error: {
                        duration: 4000,
                        style: {
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #ef4444',
                        },
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: '#fef2f2',
                        },
                    },
                }}
            />
        </div>
    );
}
