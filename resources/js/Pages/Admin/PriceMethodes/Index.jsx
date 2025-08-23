import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { useTranslation } from 'react-i18next';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Index({ auth, priceMethodes, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} à ${hours}:${minutes}:${seconds}`;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/price-methodes', { search });
    };

    const handleDelete = (priceMethode) => {
        // Vérifier d'abord combien de produits sont associés
        const produitsCount = priceMethode.produit_prices_count;
        
        if (produitsCount > 0) {
            // Confirmation spéciale pour méthodes avec produits associés
            instantToast.confirm({
                title: t('confirmDeletePaymentMethodWithProducts'),
                message: t('deletePaymentMethodWithProductsMessage', { count: produitsCount }),
                confirmText: t('confirmDeleteAll'),
                cancelText: t('cancel'),
                variant: 'danger',
                onConfirm: () => {
                    router.delete(`/admin/price-methodes/${priceMethode.id}`, {
                        onSuccess: () => {
                            instantToast.success(t('paymentMethodDeletedSuccess', { name: priceMethode.methode_name }));
                        },
                        onError: (errors) => {
                            if (errors.error) {
                                instantToast.error(errors.error);
                            } else {
                                instantToast.error(t('errorDeletingPaymentMethod'));
                            }
                        }
                    });
                }
            });
        } else {
            // Confirmation simple pour méthodes sans produits associés
            instantToast.confirm({
                title: t('confirmDeletePaymentMethod'),
                message: t('confirmDeletePaymentMethodMessage', { name: priceMethode.methode_name }),
                confirmText: t('delete'),
                cancelText: t('cancel'),
                variant: 'danger',
                onConfirm: () => {
                    router.delete(`/admin/price-methodes/${priceMethode.id}`, {
                        onSuccess: () => {
                            instantToast.success(t('paymentMethodDeletedSuccess', { name: priceMethode.methode_name }));
                        },
                        onError: (errors) => {
                            if (errors.error) {
                                instantToast.error(errors.error);
                            } else {
                                instantToast.error(t('errorDeletingPaymentMethod'));
                            }
                        }
                    });
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('paymentMethodManagement')}
                    </h2>
                    <Link
                        href="/admin/price-methodes/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 w-full sm:w-auto"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>{t('addPaymentMethod')}</span>
                    </Link>
                </div>
            }
        >
            <Head title={t('paymentMethods')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtres */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleSearch} className="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('search')}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-2 rounded-lg transition-colors duration-200 font-medium text-base sm:text-sm flex items-center justify-center space-x-2"
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5 sm:hidden" />
                                    <span>{t('search')}</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Tableau des méthodes de prix - Desktop */}
                    <div className="hidden md:block bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('paymentMethodName')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('productsLinkedCount')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('creationDate')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('modificationDate')}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {priceMethodes.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                {t('noPaymentMethodsFound')}
                                            </td>
                                        </tr>
                                    ) : (
                                        priceMethodes.data.map((priceMethode) => (
                                            <tr key={priceMethode.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white">
                                                            <CreditCardIcon className="h-5 w-5" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {priceMethode.methode_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                        {priceMethode.produit_prices_count} produits
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    <div className="text-sm">
                                                        {formatDateTime(priceMethode.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    <div className="text-sm">
                                                        {formatDateTime(priceMethode.updated_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={`/admin/price-methodes/${priceMethode.id}/edit`}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded transition-colors duration-200"
                                                            title={t('edit')}
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        
                                                        <button
                                                            onClick={() => handleDelete(priceMethode)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors duration-200"
                                                            title={t('delete')}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Version Mobile - Cards */}
                    <div className="md:hidden space-y-4">
                        {priceMethodes.data.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                                <div className="text-gray-500 dark:text-gray-400">
                                    {t('noPaymentMethodsFound')}
                                </div>
                            </div>
                        ) : (
                            priceMethodes.data.map((priceMethode) => (
                                <div key={priceMethode.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                                    {/* Header avec icône et nom */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white">
                                                <CreditCardIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {priceMethode.methode_name}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                        {priceMethode.produit_prices_count} {t('products')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400 w-20 font-medium">{t('created')}:</span>
                                            <span className="text-gray-900 dark:text-gray-100">{formatDateTime(priceMethode.created_at)}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400 w-20 font-medium">{t('updated')}:</span>
                                            <span className="text-gray-900 dark:text-gray-100">{formatDateTime(priceMethode.updated_at)}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                                        <Link
                                            href={`/admin/price-methodes/${priceMethode.id}/edit`}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            <PencilIcon className="h-4 w-4 mr-1" />
                                            {t('edit')}
                                        </Link>
                                        
                                        <button
                                            onClick={() => handleDelete(priceMethode)}
                                            className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                        >
                                            <TrashIcon className="h-4 w-4 mr-1" />
                                            {t('delete')}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* Pagination - Commune aux deux versions */}
                    {priceMethodes.links && (
                        <div className="bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between md:hidden">
                                    {priceMethodes.prev_page_url && (
                                        <Link
                                            href={priceMethodes.prev_page_url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            {t('previous')}
                                        </Link>
                                    )}
                                    {priceMethodes.next_page_url && (
                                        <Link
                                            href={priceMethodes.next_page_url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            {t('next')}
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {t('showingResults', { from: priceMethodes.from, to: priceMethodes.to, total: priceMethodes.total })}
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {priceMethodes.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                                                        link.active
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200'
                                                            : link.url
                                                            ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                                                            : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                                                    } ${
                                                        index === 0 ? 'rounded-l-md' : ''
                                                    } ${
                                                        index === priceMethodes.links.length - 1 ? 'rounded-r-md' : ''
                                                    }`}
                                                >
                                                    {link.label.includes('Previous') ? t('previous') : 
                                                     link.label.includes('Next') ? t('next') : 
                                                     <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}