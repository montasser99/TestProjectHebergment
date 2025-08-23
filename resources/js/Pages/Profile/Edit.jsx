import AuthenticatedLayoutAdmin from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import AuthenticatedLayoutClient from '@/Layouts/Client/AuthenticatedLayoutClient';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    const { t } = useTranslation();
        const { props } = usePage();

    const user = props.auth?.user;
    
    // Choisir le layout selon le rôle
    const AuthenticatedLayout = (user?.role === 'admin' || user?.role === 'gestionnaire_commande') 
        ? AuthenticatedLayoutAdmin 
        : AuthenticatedLayoutClient;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('profile')}
                    </h2>
                </div>
            }
        >
            <Head title={t('profile')} />

            <div className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sm:rounded-lg sm:p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sm:rounded-lg sm:p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>
                    {user?.role === "admin" && (
                        <div className="bg-white dark:bg-gray-800 p-4 shadow-sm sm:rounded-lg sm:p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
