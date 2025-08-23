import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthHeader from '@/Components/AuthHeader';
import { Head, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function ConfirmPassword() {
    const { t, i18n } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    // Initialiser la langue depuis localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
        }
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Head title="Confirmer le mot de passe" />
            
            <AuthHeader />
            
            {/* Main Content */}
            <div className="flex min-h-screen items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Confirmer le mot de passe
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Zone sécurisée - Confirmation requise
                            </p>
                        </div>

                        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                            Ceci est une zone sécurisée de l'application. Veuillez confirmer votre mot de passe avant de continuer.
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="password" value={t('currentPassword')} className="text-gray-700 dark:text-gray-300" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    isFocused={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Saisissez votre mot de passe actuel"
                                    required
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <PrimaryButton 
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50" 
                                disabled={processing}
                            >
                                {processing ? 'Vérification...' : 'Confirmer'}
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
