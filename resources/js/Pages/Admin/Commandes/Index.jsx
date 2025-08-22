import AuthenticatedLayoutAdmin from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import instantToast from '@/Utils/InstantToast';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
    EyeIcon,
    CheckIcon,
    XCircleIcon,
    ClockIcon,
    UserIcon,
    ShoppingCartIcon,
    DocumentTextIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

export default function Index({ commandes, filters }) {
    const { t } = useTranslation();
    
    // États pour les filtres
    const [search, setSearch] = useState(filters.search || '');
    const [selectedStatut, setSelectedStatut] = useState(filters.statut || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    // Appliquer les filtres
    const applyFilters = () => {
        const params = new URLSearchParams();
        
        if (search) params.append('search', search);
        if (selectedStatut) params.append('statut', selectedStatut);
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);

        router.get(`/admin/commandes?${params.toString()}`);
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearch('');
        setSelectedStatut('');
        setDateFrom('');
        setDateTo('');
        router.get('/admin/commandes');
    };

    // Confirmer commande
    const handleConfirm = (commande) => {
        instantToast.confirm({
            title: t('confirm'),
            message: t('confirmOrderConfirmation'),
            confirmText: t('confirm'),
            cancelText: t('cancel'),
            variant: 'success',
            onConfirm: () => {
                router.post(`/admin/commandes/${commande.id}/confirm`, {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        instantToast.success(t('orderConfirmedSuccess'));
                    },
                    onError: (errors) => {
                        if (errors.error) {
                            instantToast.error(errors.error);
                        } else {
                            instantToast.error(t('errorConfirmingOrder'));
                        }
                    }
                });
            }
        });
    };

    // Annuler commande
    const handleCancel = (commande) => {
        instantToast.confirm({
            title: t('cancel'),
            message: t('confirmOrderCancellation'),
            confirmText: t('cancel'),
            cancelText: 'Retour',
            variant: 'danger',
            onConfirm: () => {
                router.post(`/admin/commandes/${commande.id}/cancel`, {}, {
                    preserveScroll: true,
                    onSuccess: () => {
                        instantToast.success(t('orderCancelledSuccess'));
                    },
                    onError: (errors) => {
                        if (errors.error) {
                            instantToast.error(errors.error);
                        } else {
                            instantToast.error(t('errorCancellingOrder'));
                        }
                    }
                });
            }
        });
    };

    // Couleurs de statut
    const getStatutColor = (statut) => {
        switch (statut) {
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'confirme':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'annuler':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    // Icône de statut
    const getStatutIcon = (statut) => {
        switch (statut) {
            case 'en_attente':
                return <ClockIcon className="h-4 w-4" />;
            case 'confirme':
                return <CheckIcon className="h-4 w-4" />;
            case 'annuler':
                return <XCircleIcon className="h-4 w-4" />;
            default:
                return <DocumentTextIcon className="h-4 w-4" />;
        }
    };

    // Texte de statut traduit
    const getStatutText = (statut) => {
        switch (statut) {
            case 'en_attente':
                return t('pending');
            case 'confirme':
                return t('confirmed');
            case 'annuler':
                return t('cancelled');
            default:
                return statut;
        }
    };


    return (
        <AuthenticatedLayoutAdmin
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {t('orders')} - {t('management')}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('manageAllOrders')}
                        </p>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {commandes.total} {t('ordersFound')}
                    </div>
                </div>
            }
        >
            <Head title={`${t('orders')} - Admin`} />

            <div className="py-6">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    {/* Filtres horizontaux */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            {/* Recherche */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('search')}
                                </label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={t('searchByUserNameOrEmail')}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Statut */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('status')}
                                </label>
                                <select
                                    value={selectedStatut}
                                    onChange={(e) => setSelectedStatut(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">{t('allStatuses')}</option>
                                    <option value="en_attente">{t('pending')}</option>
                                    <option value="confirme">{t('confirmed')}</option>
                                    <option value="annuler">{t('cancelled')}</option>
                                </select>
                            </div>

                            {/* Date de début */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('from')}
                                </label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            {/* Date de fin */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('to')}
                                </label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex items-center space-x-3 mt-4">
                            <button
                                onClick={applyFilters}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
                            >
                                <FunnelIcon className="h-4 w-4 mr-2" />
                                {t('applyFilters')}
                            </button>
                            <button
                                onClick={resetFilters}
                                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                {t('resetFilters')}
                            </button>
                        </div>
                    </div>

                    {/* Liste des commandes */}
                    {commandes.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <ShoppingCartIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                {t('noOrdersFound')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('tryModifyingFilters')}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('order')}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('customer')}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('date')}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('total')}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('status')}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                        {t('actions')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                {commandes.data.map((commande) => (
                                                    <tr key={commande.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <ShoppingCartIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        #{commande.id}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {commande.commande_produits?.length || 0} {t('products')}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                        {commande.user?.name}
                                                                    </div>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                        {commande.user?.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                                <div className="text-sm text-gray-900 dark:text-white">
                                                                    {new Date(commande.date_commande).toLocaleString('fr-FR', {
                                                                        day: '2-digit',
                                                                        month: '2-digit', 
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        second: '2-digit'
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {commande.total_amount} TND
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {commande.payment_method_name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatutColor(commande.statut)}`}>
                                                                {getStatutIcon(commande.statut)}
                                                                <span className="ml-1">{getStatutText(commande.statut)}</span>
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end space-x-2">
                                                                <Link
                                                                    href={`/admin/commandes/${commande.id}`}
                                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                                                    title={t('view')}
                                                                >
                                                                    <EyeIcon className="h-4 w-4" />
                                                                </Link>
                                                                {commande.statut === 'en_attente' && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleConfirm(commande)}
                                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 inline-flex items-center p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                                                                            title={t('confirm')}
                                                                        >
                                                                            <CheckIcon className="h-4 w-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleCancel(commande)}
                                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 inline-flex items-center p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                            title={t('cancel')}
                                                                        >
                                                                            <XCircleIcon className="h-4 w-4" />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {commandes.data.length > 0 && commandes.links && (
                        <div className="mt-6 bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 sm:px-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                            {commandes.prev_page_url && (
                                                <Link
                                                    href={commandes.prev_page_url}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                                >
                                                    {t('previous')}
                                                </Link>
                                            )}
                                            {commandes.next_page_url && (
                                                <Link
                                                    href={commandes.next_page_url}
                                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                                >
                                                    {t('next')}
                                                </Link>
                                            )}
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    {t('showing')} <span className="font-medium">{commandes.from}</span> {t('to')}{' '}
                                                    <span className="font-medium">{commandes.to}</span> {t('of')}{' '}
                                                    <span className="font-medium">{commandes.total}</span> {t('results')}
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                                    {commandes.links.map((link, index) => (
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
                                                                index === commandes.links.length - 1 ? 'rounded-r-md' : ''
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
            </div>
        </AuthenticatedLayoutAdmin>
    );
}