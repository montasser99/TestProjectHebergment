import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Edit({ auth, priceMethode }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        methode_name: priceMethode.methode_name || '',
    });

    const handleNameChange = (e) => {
        const value = e.target.value;
        // Limiter à 25 caractères
        if (value.length <= 25) {
            setData('methode_name', value);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        
        put(route('admin.price-methodes.update', priceMethode.id), {
            onSuccess: () => {
                instantToast.success(t('paymentMethodUpdatedSuccess', { name: data.methode_name }));
            },
            onError: (errors) => {
                instantToast.error(t('errorUpdatingPaymentMethod'));
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/price-methodes"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('editPaymentMethod')} : {priceMethode.methode_name}
                    </h2>
                </div>
            }
        >
            <Head title={`${t('editPaymentMethod')} - ${priceMethode.methode_name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Nom de la méthode */}
                                <div>
                                    <label htmlFor="methode_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {t('paymentMethodName')} *
                                    </label>
                                    <input
                                        type="text"
                                        id="methode_name"
                                        value={data.methode_name}
                                        onChange={handleNameChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                        maxLength="25"
                                        required
                                        placeholder="Ex: d17, carte_ooredoo, paypal..."
                                    />
                                    <div className="mt-1 flex justify-between items-center">
                                        <div>
                                            {errors.methode_name && (
                                                <p className="text-sm text-red-600 dark:text-red-400">{errors.methode_name}</p>
                                            )}
                                        </div>
                                        <p className={`text-xs ${data.methode_name.length > 20 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {data.methode_name.length}/25
                                        </p>
                                    </div>
                                </div>

                                {/* Boutons */}
                                <div className="flex items-center justify-end space-x-4 pt-4">
                                    <Link
                                        href="/admin/price-methodes"
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        {t('cancel')}
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Mise à jour...' : t('save')}
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