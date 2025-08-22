import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayoutClient from '@/Layouts/Client/AuthenticatedLayoutClient';
import PaymentMethodGuard from '@/Utils/PaymentMethodGuard';
import { useTranslation } from 'react-i18next';
import { 
    CheckCircleIcon,
    ClockIcon,
    ShoppingBagIcon,
    UserIcon,
    CreditCardIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

export default function OrderSuccess({ auth, commande }) {
    const { t } = useTranslation();

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} à ${hours}:${minutes}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'en_attente': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'confirme': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
            case 'annuler': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'en_attente': return t('pending');
            case 'confirme': return t('confirmed');
            case 'annuler': return t('cancelled');
            default: return status;
        }
    };

    return (
        <PaymentMethodGuard>
            <AuthenticatedLayoutClient
            header={
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('orderSuccess')}
                    </h2>
                </div>
            }
        >
            <Head title={t('orderSuccess')} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Message de succès */}
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-8">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-8 w-8 text-green-400" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-green-800 dark:text-green-200">
                                    {t('orderPlacedSuccessfully')}
                                </h3>
                                <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                                    {t('thankYou')} #{commande.id}. {t('willContactSoon')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Détails de la commande */}
                        <div className="space-y-6">
                            {/* Informations générales */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                        <ClockIcon className="h-5 w-5 mr-2" />
                                        {t('orderInformation')}
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('orderNumber')}</span>
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">#{commande.id}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('orderDate')}</span>
                                            <span className="text-sm text-gray-900 dark:text-white">
                                                {formatDateTime(commande.date_commande)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('status')}</span>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(commande.statut)}`}>
                                                {getStatusLabel(commande.statut)}
                                            </span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('paymentMethodText')}</span>
                                            <span className="text-sm text-gray-900 dark:text-white capitalize">
                                                {commande.payment_method_name.replace('_', ' ')}
                                            </span>
                                        </div>
                                        
                                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-medium text-gray-900 dark:text-white">{t('total')}</span>
                                                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                    {parseFloat(commande.total_amount).toFixed(3)} TND
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Informations de contact */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                        <UserIcon className="h-5 w-5 mr-2" />
                                        {t('contactInformation')}
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {commande.client_facebook && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">Facebook:</span>
                                                <span className="text-sm text-gray-900 dark:text-white">{commande.client_facebook}</span>
                                            </div>
                                        )}
                                        
                                        {commande.client_instagram && (
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-20">Instagram:</span>
                                                <span className="text-sm text-gray-900 dark:text-white">{commande.client_instagram}</span>
                                            </div>
                                        )}
                                        
                                        {commande.notes_client && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 block mb-1">Notes:</span>
                                                <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                                    {commande.notes_client}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Produits commandés */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <ShoppingBagIcon className="h-5 w-5 mr-2" />
                                    {t('orderedProducts')} ({commande.commande_produits.length})
                                </h3>
                                
                                <div className="space-y-4">
                                    {commande.commande_produits.map((item, index) => (
                                        <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                            {/* Image */}
                                            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                {item.produit_image ? (
                                                    <img
                                                        src={`/storage/${item.produit_image}`}
                                                        alt={item.produit_label}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Informations */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                                    {item.produit_label}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.produit_quantity} {item.produit_unit}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {t('quantity')}: {item.quantite_commandee}
                                                    </span>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                                        {parseFloat(item.prix_unitaire).toFixed(3)} {item.produit_currency}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Sous-total */}
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {parseFloat(item.sous_total).toFixed(3)} {item.produit_currency}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/orders/history"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
                        >
                            {t('viewOrderHistory')}
                        </Link>
                        
                        <button
                            onClick={() => {
                                const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
                                if (savedPaymentMethod) {
                                    const paymentMethod = JSON.parse(savedPaymentMethod);
                                    router.visit(`/client/products?payment_method_id=${paymentMethod.id}`);
                                } else {
                                    router.visit('/client/payment-method');
                                }
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium text-center transition-colors"
                        >
                            {t('continueShopping')}
                        </button>
                    </div>
                </div>
            </div>
            </AuthenticatedLayoutClient>
        </PaymentMethodGuard>
    );
}