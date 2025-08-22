import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { useTranslation } from 'react-i18next';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    TagIcon
} from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Index({ auth, typeProduits, filters }) {
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
        router.get('/admin/type-produits', { search });
    };

    const handleDelete = (typeProduit) => {
        // Vérifier d'abord combien de produits sont associés
        const produitsCount = typeProduit.produits_count;
        
        if (produitsCount > 0) {
            // Confirmation spéciale pour types avec produits associés
            instantToast.confirm({
                title: t('confirmDeleteWithProducts'),
                message: t('deleteTypeWithProductsMessage', { count: produitsCount }),
                confirmText: t('confirmDeleteAll'),
                cancelText: t('cancel'),
                variant: 'danger',
                onConfirm: () => {
                    router.delete(`/admin/type-produits/${typeProduit.id}`, {
                        onSuccess: () => {
                            instantToast.success(t('productTypeDeletedSuccess', { name: typeProduit.name }));
                        },
                        onError: (errors) => {
                            if (errors.error) {
                                instantToast.error(errors.error);
                            } else {
                                instantToast.error(t('errorDeletingProductType'));
                            }
                        }
                    });
                }
            });
        } else {
            // Confirmation simple pour types sans produits associés
            instantToast.confirm({
                title: t('confirmDeleteProductType'),
                message: t('confirmDeleteProductTypeMessage', { name: typeProduit.name }),
                confirmText: t('delete'),
                cancelText: t('cancel'),
                variant: 'danger',
                onConfirm: () => {
                    router.delete(`/admin/type-produits/${typeProduit.id}`, {
                        onSuccess: () => {
                            instantToast.success(t('productTypeDeletedSuccess', { name: typeProduit.name }));
                        },
                        onError: (errors) => {
                            if (errors.error) {
                                instantToast.error(errors.error);
                            } else {
                                instantToast.error(t('errorDeletingProductType'));
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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('productTypeManagement')}
                    </h2>
                    <Link
                        href="/admin/type-produits/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>{t('addProductType')}</span>
                    </Link>
                </div>
            }
        >
            <Head title={t('productTypes')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtres */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('search')}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                                >
                                    {t('search')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Tableau des types de produits */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('productTypeName')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('productsCount')}
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
                                    {typeProduits.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                {t('noProductTypesFound')}
                                            </td>
                                        </tr>
                                    ) : (
                                        typeProduits.data.map((typeProduit) => (
                                            <tr key={typeProduit.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white">
                                                            <TagIcon className="h-5 w-5" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {typeProduit.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {typeProduit.produits_count} produits
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    <div className="text-sm">
                                                        {formatDateTime(typeProduit.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    <div className="text-sm">
                                                        {formatDateTime(typeProduit.updated_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={`/admin/type-produits/${typeProduit.id}/edit`}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded transition-colors duration-200"
                                                            title={t('edit')}
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        
                                                        <button
                                                            onClick={() => handleDelete(typeProduit)}
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

                        {/* Pagination */}
                        {typeProduits.links && (
                            <div className="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        {typeProduits.prev_page_url && (
                                            <Link
                                                href={typeProduits.prev_page_url}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                {t('previous')}
                                            </Link>
                                        )}
                                        {typeProduits.next_page_url && (
                                            <Link
                                                href={typeProduits.next_page_url}
                                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                {t('next')}
                                            </Link>
                                        )}
                                    </div>
                                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {t('showingResults', { from: typeProduits.from, to: typeProduits.to, total: typeProduits.total })}
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                {typeProduits.links.map((link, index) => (
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
                                                            index === typeProduits.links.length - 1 ? 'rounded-r-md' : ''
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
            </div>
        </AuthenticatedLayout>
    );
}