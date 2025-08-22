import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Create({ auth }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '+216',
        password: '',
        password_confirmation: '',
        role: 'client',
    });

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Accepter seulement les chiffres et limiter à 8 caractères
        const digits = value.replace(/\D/g, '').slice(0, 8);
        setData('phone', '+216' + digits);
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        // Limiter à 30 caractères
        if (value.length <= 30) {
            setData('name', value);
        }
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
        
        post(route('admin.users.store'), {
            onSuccess: () => {
                instantToast.success(t('userCreatedSuccess', { name: data.name }));
            },
            onError: (errors) => {
                instantToast.error(t('errorCreating'));
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/users"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('addUser')}
                    </h2>
                </div>
            }
        >
            <Head title={t('addUser')} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Nom */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('name')} *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                        maxLength="30"
                                        required
                                    />
                                    <div className="mt-1 flex justify-between items-center">
                                        <div>
                                            {errors.name && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                            )}
                                        </div>
                                        <p className={`text-xs ${data.name.length > 25 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {data.name.length}/30
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('email')} *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                        required
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                {/* Téléphone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('phone')} *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 dark:text-gray-400 font-medium">+216</span>
                                        </div>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={data.phone.replace('+216', '')}
                                            onChange={handlePhoneChange}
                                            className="w-full pl-16 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200"
                                            placeholder="XX XXX XXX"
                                            maxLength="8"
                                            pattern="[0-9]{8}"
                                            required
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        8 chiffres obligatoires après +216
                                    </p>
                                </div>

                                {/* Rôle */}
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('role')} *
                                    </label>
                                    <select
                                        id="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                        required
                                    >
                                        <option value="client">{t('client')}</option>
                                        <option value="admin">{t('admin')}</option>
                                    </select>
                                    {errors.role && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>
                                    )}
                                </div>

                                {/* Mot de passe */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('password')} *
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                        required
                                        minLength="8"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                    )}
                                    {/* Indicateurs de force du mot de passe */}
                                    {data.password && (
                                        <div className="mt-2 space-y-1">
                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Force du mot de passe :</p>
                                            <div className="space-y-1">
                                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                                                    <span>{passwordValidation.minLength ? '✓' : '✗'}</span>
                                                    <span>Au moins 8 caractères</span>
                                                </div>
                                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                                                    <span>{passwordValidation.hasUpperCase ? '✓' : '✗'}</span>
                                                    <span>Une lettre majuscule</span>
                                                </div>
                                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                                                    <span>{passwordValidation.hasLowerCase ? '✓' : '✗'}</span>
                                                    <span>Une lettre minuscule</span>
                                                </div>
                                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-600'}`}>
                                                    <span>{passwordValidation.hasNumbers ? '✓' : '✗'}</span>
                                                    <span>Un chiffre</span>
                                                </div>
                                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                                                    <span>{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                                                    <span>Un caractère spécial (!@#$%^&*)</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirmation mot de passe */}
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('confirmPassword')} *
                                    </label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                        required
                                        minLength="8"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Boutons */}
                                <div className="flex items-center justify-end space-x-4 pt-4">
                                    <Link
                                        href="/admin/users"
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        {t('cancel')}
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Création...' : t('save')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}