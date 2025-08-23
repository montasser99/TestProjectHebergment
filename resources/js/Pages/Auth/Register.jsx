import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthHeader from '@/Components/AuthHeader';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function Register() {
    const { t, i18n } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '+216',
        password: '',
        password_confirmation: '',
    });

    // Initialiser la langue depuis localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
        }
    }, []);

    const handleNameChange = (e) => {
        const value = e.target.value;
        // Limiter à 30 caractères
        if (value.length <= 30) {
            setData('name', value);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Accepter seulement les chiffres et limiter à 8 caractères
        const digits = value.replace(/\D/g, '').slice(0, 8);
        setData('phone', '+216' + digits);
    };

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
        };
    };

    const passwordValidation = validatePassword(data.password);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Head title={t('register')} />
            
            <AuthHeader />
            
            {/* Main Content */}
            <div className="flex min-h-screen items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('register')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('createNewAccount')}
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value={t('name')} className="text-gray-700 dark:text-gray-300" />

                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={handleNameChange}
                                    maxLength="30"
                                    placeholder={t('enterName')}
                                    required
                                />

                                <div className="mt-1 flex justify-between items-center">
                                    <div>
                                        <InputError message={errors.name} />
                                    </div>
                                    <p className={`text-xs ${data.name.length > 25 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {data.name.length}/30
                                    </p>
                                </div>
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value={t('email')} className="text-gray-700 dark:text-gray-300" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={t('enterEmail')}
                                    required
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value={t('phone')} className="text-gray-700 dark:text-gray-300" />

                                <div className="relative mt-2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">+216</span>
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={data.phone.replace('+216', '')}
                                        onChange={handlePhoneChange}
                                        className="block w-full pl-16 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                                        placeholder="XX XXX XXX"
                                        maxLength="8"
                                        pattern="[0-9]{8}"
                                        required
                                    />
                                </div>

                                <InputError message={errors.phone} className="mt-2" />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {t('phoneHelp')}
                                </p>
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value={t('password')} className="text-gray-700 dark:text-gray-300" />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    minLength="8"
                                    placeholder={t('enterPassword')}
                                    required
                                />

                                <InputError message={errors.password} className="mt-2" />
                                
                                {/* Indicateurs de force du mot de passe */}
                                {data.password && (
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('passwordStrength')} :</p>
                                        <div className="space-y-1">
                                            <div className={`flex items-center space-x-2 text-xs ${passwordValidation.minLength ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                <span>{passwordValidation.minLength ? '✓' : '✗'}</span>
                                                <span>{t('atLeast8Chars')}</span>
                                            </div>
                                            <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                <span>{passwordValidation.hasUpperCase ? '✓' : '✗'}</span>
                                                <span>{t('oneUppercase')}</span>
                                            </div>
                                            <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                <span>{passwordValidation.hasLowerCase ? '✓' : '✗'}</span>
                                                <span>{t('oneLowercase')}</span>
                                            </div>
                                            <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasNumbers ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                <span>{passwordValidation.hasNumbers ? '✓' : '✗'}</span>
                                                <span>{t('oneDigit')}</span>
                                            </div>
                                            <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                <span>{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                                                <span>{t('oneSpecialChar')}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value={t('confirmPassword')}
                                    className="text-gray-700 dark:text-gray-300"
                                />

                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    placeholder={t('confirmYourPassword')}
                                    required
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <PrimaryButton 
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50" 
                                disabled={processing}
                            >
                                {processing ? t('creatingAccount') : t('register')}
                            </PrimaryButton>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {t('alreadyHaveAccount')}{' '}
                                <Link
                                    href={route('login')}
                                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                                >
                                    {t('login')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
