import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Create({ auth }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleNameChange = (e) => {
        const value = e.target.value;
        // Limiter à 25 caractères
        if (value.length <= 25) {
            setData('name', value);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        post(route('admin.type-produits.store'), {
            onSuccess: () => {
                instantToast.success(t('productTypeCreatedSuccess', { name: data.name }));
            },
            onError: (errors) => {
                instantToast.error(t('errorCreatingProductType'));
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/type-produits"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('addProductType')}
                    </h2>
                </div>
            }
        >
            <Head title={t('addProductType')} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Nom du type */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('productTypeName')} *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={handleNameChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                        maxLength="25"
                                        required
                                        placeholder="Ex: Gaming, Internet, Subscription..."
                                    />
                                    <div className="mt-1 flex justify-between items-center">
                                        <div>
                                            {errors.name && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                            )}
                                        </div>
                                        <p className={`text-xs ${data.name.length > 20 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {data.name.length}/25
                                        </p>
                                    </div>
                                </div>

                                {/* Boutons */}
                                <div className="flex items-center justify-end space-x-4 pt-4">
                                    <Link
                                        href="/admin/type-produits"
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