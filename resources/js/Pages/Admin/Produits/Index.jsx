import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { useTranslation } from 'react-i18next';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    EyeIcon,
    CubeIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Index({ auth, produits, typeProduits, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [typeProduitId, setTypeProduitId] = useState(filters.type_produit_id || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/produits', { search, type_produit_id: typeProduitId });
    };

    const handleDelete = (produit) => {
        instantToast.confirm({
            title: t('confirmDeleteProduct'),
            message: t('confirmDeleteProductMessage', { name: produit.label }),
            confirmText: t('delete'),
            cancelText: t('cancel'),
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/produits/${produit.id}`, {
                    onSuccess: () => {
                        instantToast.success(t('productDeletedSuccess', { name: produit.label }));
                    },
                    onError: (errors) => {
                        if (errors.error) {
                            instantToast.error(errors.error);
                        } else {
                            instantToast.error(t('errorDeletingProduct'));
                        }
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('productManagement')}
                    </h2>
                    <Link
                        href="/admin/produits/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>{t('addProduct')}</span>
                    </Link>
                </div>
            }
        >
            <Head title={t('products')} />

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
                                
                                <div className="sm:w-48">
                                    <select
                                        value={typeProduitId}
                                        onChange={(e) => setTypeProduitId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">{t('allTypes')}</option>
                                        {typeProduits.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
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

                    {/* Grille des produits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {produits.data.length === 0 ? (
                            <div className="col-span-full bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    {t('noProductsFound')}
                                </div>
                            </div>
                        ) : (
                            produits.data.map((produit) => (
                                <div key={produit.id} className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg hover:shadow-lg transition-shadow duration-200">
                                    {/* Image du produit */}
                                    <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                        {produit.image ? (
                                            <img
                                                src={`/storage/${produit.image}`}
                                                alt={produit.label}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <PhotoIcon className="h-16 w-16 text-gray-400" />
                                            </div>
                                        )}
                                        
                                        {/* Badge type */}
                                        <div className="absolute top-2 left-2">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {produit.type_produit?.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                                {produit.label}
                                            </h3>
                                            <div className="flex items-center ml-2">
                                                <CubeIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {produit.quantity} {produit.unit}
                                                </span>
                                            </div>
                                        </div>

                                        {produit.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                {produit.description}
                                            </p>
                                        )}

                                        {/* Prix et contact */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <span className="font-medium">{produit.produit_prices_count}</span> prix configurés
                                            </div>
                                            {produit.contact_social_media && (
                                                <div className="text-xs text-green-600 dark:text-green-400">
                                                    Contact disponible
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link
                                                href={`/admin/produits/${produit.id}`}
                                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded transition-colors duration-200"
                                                title={t('viewProduct')}
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </Link>
                                            
                                            <Link
                                                href={`/admin/produits/${produit.id}/edit`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded transition-colors duration-200"
                                                title={t('editProduct')}
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Link>
                                            
                                            <button
                                                onClick={() => handleDelete(produit)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded transition-colors duration-200"
                                                title={t('delete')}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {produits.links && produits.data.length > 0 && (
                        <div className="mt-6 bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 sm:px-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {produits.prev_page_url && (
                                        <Link
                                            href={produits.prev_page_url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            {t('previous')}
                                        </Link>
                                    )}
                                    {produits.next_page_url && (
                                        <Link
                                            href={produits.next_page_url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            {t('next')}
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {t('showingResults', { from: produits.from, to: produits.to, total: produits.total })}
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {produits.links.map((link, index) => (
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
                                                        index === produits.links.length - 1 ? 'rounded-r-md' : ''
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