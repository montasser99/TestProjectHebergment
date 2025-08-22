import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayoutClient from '@/Layouts/Client/AuthenticatedLayoutClient';
import PaymentMethodGuard from '@/Utils/PaymentMethodGuard';
import { useTranslation } from 'react-i18next';
import {
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ShoppingBagIcon,
    CalendarIcon,
    CreditCardIcon,
    EyeIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function OrderHistory({ auth, commandes }) {
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'en_attente': return ClockIcon;
            case 'confirme': return CheckCircleIcon;
            case 'annuler': return XCircleIcon;
            default: return ClockIcon;
        }
    };

    return (
        <PaymentMethodGuard>
            <AuthenticatedLayoutClient
                header={
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                {t('orderHistory')}
                            </h2>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {commandes.total} {t('ordersFound')}
                        </div>
                    </div>
                }
            >
                <Head title={t('orderHistory')} />

                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {commandes.data.length === 0 ? (
                            // Aucune commande
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                                <ShoppingBagIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    {t('noOrdersYet')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {t('startShoppingDescription')}
                                </p>
                                <button
                                    onClick={() => {
                                        const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
                                        if (savedPaymentMethod) {
                                            const paymentMethod = JSON.parse(savedPaymentMethod);
                                            window.location.href = `/client/products?payment_method_id=${paymentMethod.id}`;
                                        } else {
                                            window.location.href = '/client/payment-method';
                                        }
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {t('continueShopping')}
                                </button>
                            </div>
                        ) : (
                            // Liste des commandes
                            <div className="space-y-6">
                                {commandes.data.map((commande) => {
                                    const StatusIcon = getStatusIcon(commande.statut);

                                    return (
                                        <div key={commande.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                            <div className="p-6">
                                                {/* En-tête de la commande */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center space-x-4">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {t('order')} #{commande.id}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commande.statut)}`}>
                                                            <StatusIcon className="h-3 w-3 mr-1" />
                                                            {getStatusLabel(commande.statut)}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                                            {parseFloat(commande.total_amount).toFixed(3)} TND
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {formatDateTime(commande.date_commande)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Informations générales */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <CalendarIcon className="h-4 w-4 mr-2" />
                                                        <span>{formatDateTime(commande.date_commande)}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <CreditCardIcon className="h-4 w-4 mr-2" />
                                                        <span className="capitalize">{commande.payment_method_name.replace('_', ' ')}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <ShoppingBagIcon className="h-4 w-4 mr-2" />
                                                        <span>{t('itemsCount', { count: commande.commande_produits.length })}</span>
                                                    </div>
                                                </div>

                                                {/* Produits de la commande */}
                                                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                        {t('orderedProducts')}
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {commande.commande_produits.slice(0, 3).map((item, index) => (
                                                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                                <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600">
                                                                    {item.produit_image ? (
                                                                        <img
                                                                            src={`/storage/${item.produit_image}`}
                                                                            alt={item.produit_label}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center">
                                                                            <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                                        {item.produit_label}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                        {t('quantity')}: {item.quantite_commandee} • {parseFloat(item.prix_unitaire).toFixed(3)} TND
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        {commande.commande_produits.length > 3 && (
                                                            <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                    +{commande.commande_produits.length - 3} autres...
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Informations de contact */}
                                                {(commande.client_facebook || commande.client_instagram || commande.notes_client) && (
                                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4">
                                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                                            {t('contactInformation')}
                                                        </h4>
                                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                            {commande.client_facebook && (
                                                                <p><strong>Facebook:</strong> {commande.client_facebook}</p>
                                                            )}
                                                            {commande.client_instagram && (
                                                                <p><strong>Instagram:</strong> {commande.client_instagram}</p>
                                                            )}
                                                            {commande.notes_client && (
                                                                <p><strong>Votre Notes:</strong> {commande.notes_client}</p>
                                                            )}
                                                            {commande.notes_admin && (
                                                                <p><strong>Notes admin:</strong> {commande.notes_admin}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Pagination */}
                                {commandes.links && commandes.data.length > 0 && (
                                    <div className="bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 sm:px-6 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 flex justify-between sm:hidden">
                                                {commandes.prev_page_url && (
                                                    <Link
                                                        href={commandes.prev_page_url}
                                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        {t('previous')}
                                                    </Link>
                                                )}
                                                {commandes.next_page_url && (
                                                    <Link
                                                        href={commandes.next_page_url}
                                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    >
                                                        {t('next')}
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                                        {t('showingResults', { from: commandes.from, to: commandes.to, total: commandes.total })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                        {commandes.links.map((link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={link.url || '#'}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${link.active
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200'
                                                                        : link.url
                                                                            ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                                                                            : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600'
                                                                    } ${index === 0 ? 'rounded-l-md' : ''
                                                                    } ${index === commandes.links.length - 1 ? 'rounded-r-md' : ''
                                                                    }`}
                                                            >
                                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                            </Link>
                                                        ))}
                                                    </nav>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </AuthenticatedLayoutClient>
        </PaymentMethodGuard>
    );
}