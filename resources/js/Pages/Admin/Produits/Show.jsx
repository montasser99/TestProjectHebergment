import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { useTranslation } from 'react-i18next';
import { 
    ArrowLeftIcon, 
    PencilIcon, 
    PhotoIcon,
    CubeIcon,
    TagIcon,
    CreditCardIcon,
    ChatBubbleLeftIcon,
    ClockIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

export default function Show({ auth, produit }) {
    const { t } = useTranslation();

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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/produits"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {t('viewProduct')} : {produit.label}
                        </h2>
                    </div>
                    <Link
                        href={`/admin/produits/${produit.id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
                    >
                        <PencilIcon className="h-4 w-4" />
                        <span>{t('editProduct')}</span>
                    </Link>
                </div>
            }
        >
            <Head title={`${t('viewProduct')} - ${produit.label}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Colonne principale - Informations du produit */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Informations de base */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                {produit.label}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center">
                                                    <TagIcon className="h-4 w-4 mr-1" />
                                                    <span>{produit.type_produit?.name}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <CubeIcon className="h-4 w-4 mr-1" />
                                                    <span>{produit.quantity} {produit.unit}</span>
                                                </div>
                                                {produit.currency && (
                                                    <div className="flex items-center">
                                                        <span className="font-medium">{produit.currency}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {produit.type_produit?.name}
                                        </span>
                                    </div>

                                    {produit.description && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t('productDescription')}
                                            </h4>
                                            <p className="text-gray-900 dark:text-white leading-relaxed bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                {produit.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Métadonnées avec icônes et formatage amélioré */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-500 dark:text-gray-400">{t('creationDate')} :</span>
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {formatDateTime(produit.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                            <ClockIcon className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-500 dark:text-gray-400">{t('modifiedDate')} :</span>
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {formatDateTime(produit.updated_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Configuration des prix */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                        <CreditCardIcon className="h-5 w-5 mr-2" />
                                        {t('pricesConfiguration')}
                                    </h3>
                                    
                                    {produit.produit_prices && produit.produit_prices.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {produit.produit_prices.map((priceData, index) => (
                                                <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                                {priceData.price_methode?.methode_name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {t('paymentMethod')}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                                                {parseFloat(priceData.price).toFixed(3)}
                                                            </span>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                                {produit.currency || 'TND'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {t('noPriceConfigured')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact réseaux sociaux */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                        <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                                        {t('socialMediaContact')}
                                    </h3>
                                    
                                    {produit.contact_social_media ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {produit.contact_social_media.instagram_page && (
                                                <div className="flex items-center p-3 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">IG</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Instagram</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{produit.contact_social_media.instagram_page}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {produit.contact_social_media.facebook_page && (
                                                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">FB</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Facebook</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{produit.contact_social_media.facebook_page}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {produit.contact_social_media.whatsapp_number && (
                                                <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">WA</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">WhatsApp</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{produit.contact_social_media.whatsapp_number}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {produit.contact_social_media.tiktok_page && (
                                                <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-10 h-10 bg-gray-900 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">TT</span>
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">TikTok</p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{produit.contact_social_media.tiktok_page}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {t('noContactConfigured')}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {produit.contact_social_media && (
                                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                            <strong>Note :</strong> {t('contactNote')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Colonne latérale - Image et statistiques */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Image du produit */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        {t('productImage')}
                                    </h3>
                                    
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                        {produit.image ? (
                                            <img
                                                src={`/storage/${produit.image}`}
                                                alt={produit.label}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <PhotoIcon className="mx-auto h-16 w-16 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                    {t('noImage')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Statistiques rapides */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        {t('statistics')}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <div className="flex items-center">
                                                <CreditCardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('pricesConfigured')}</span>
                                            </div>
                                            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                {produit.produit_prices?.length || 0}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center">
                                                <ChatBubbleLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('contactAvailable')}</span>
                                            </div>
                                            <span className={`text-lg font-semibold ${produit.contact_social_media ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                {produit.contact_social_media ? t('yes') : t('no')}
                                            </span>
                                        </div>

                                        {produit.produit_prices && produit.produit_prices.length > 0 && (
                                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-2 flex items-center">
                                                    <TagIcon className="h-4 w-4 mr-1" />
                                                    {t('priceRange')}
                                                </span>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                                        {t('minPrice')}: {Math.min(...produit.produit_prices.map(p => parseFloat(p.price))).toFixed(3)} {produit.currency}
                                                    </span>
                                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                                        {t('maxPrice')}: {Math.max(...produit.produit_prices.map(p => parseFloat(p.price))).toFixed(3)} {produit.currency}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <CubeIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('stock')}</span>
                                                </div>
                                                <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                                                    {produit.quantity} {produit.unit}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions rapides */}
                            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                        {t('actions')}
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <Link
                                            href={`/admin/produits/${produit.id}/edit`}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                                        >
                                            <PencilIcon className="h-4 w-4 mr-2" />
                                            {t('editProduct')}
                                        </Link>
                                        
                                        <Link
                                            href="/admin/produits"
                                            className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                                        >
                                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                            {t('backToList')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}