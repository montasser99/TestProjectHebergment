import React from 'react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    UserGroupIcon,
    CheckCircleIcon,
    XCircleIcon,
    TagIcon,
    CreditCardIcon,
    CubeIcon,
    ClipboardDocumentListIcon,
    ClockIcon,
    CheckIcon,
    XMarkIcon,
    ChartBarIcon,
    ShoppingCartIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats, userRole }) {
    const { t } = useTranslation();

    const StatCard = ({ title, value, icon, color = "blue", description }) => (
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
                    <p className={`text-2xl sm:text-3xl font-bold text-${color}-600 dark:text-${color}-400 mt-1`}>{value}</p>
                    {description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{description}</p>
                    )}
                </div>
                <div className={`text-${color}-500 dark:text-${color}-400 ml-4 flex-shrink-0`}>
                    {React.cloneElement(icon, { className: 'w-6 h-6 sm:w-8 sm:h-8' })}
                </div>
            </div>
        </div>
    );

    const ChartCard = ({ title, data, type = "bar" }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                    <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    {title}
                </h3>
            </div>
            <div className="p-4 sm:p-6">
                {data && data.length > 0 ? (
                    <div className="space-y-3">
                        {data.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {item.product_name || item.user_name}
                                    </p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ 
                                                width: `${(item.max_price || item.orders_count) / Math.max(...data.map(d => d.max_price || d.orders_count)) * 100}%` 
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        {item.max_price ? `${parseFloat(item.max_price).toFixed(3)} TND` : `${item.orders_count} commandes`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">{t('noDataAvailable')}</p>
                    </div>
                )}
            </div>
        </div>
    );

    // Interface pour gestionnaire de commande
    if (userRole === 'gestionnaire_commande') {
        return (
            <AuthenticatedLayout
                header={
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {t('dashboard')} - {t('orderManagerDashboard')}
                        </h2>
                    </div>
                }
            >
                <Head title="Dashboard Gestionnaire" />

                <div className="py-6 sm:py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Welcome Message */}
                        <div className="mb-6 sm:mb-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-4 sm:p-6 text-white">
                            <h1 className="text-xl sm:text-2xl font-bold mb-2">
                                📋 {t('dashboard')} - {t('orderManagerDashboard')}
                            </h1>
                            <p className="text-sm sm:text-base text-green-100">
                                {t('manageTrackOrders')}
                            </p>
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            <StatCard
                                title={t('totalOrders')}
                                value={stats.total_orders}
                                icon={<ShoppingCartIcon className="w-8 h-8" />}
                                color="blue"
                                description={t('allOrders')}
                            />
                            <StatCard
                                title={t('pending')}
                                value={stats.pending_orders}
                                icon={<ClockIcon className="w-8 h-8" />}
                                color="yellow"
                                description={t('toProcess')}
                            />
                            <StatCard
                                title={t('confirmed')}
                                value={stats.confirmed_orders}
                                icon={<CheckIcon className="w-8 h-8" />}
                                color="green"
                                description={t('confirmed')}
                            />
                            <StatCard
                                title={t('cancelled')}
                                value={stats.cancelled_orders}
                                icon={<XMarkIcon className="w-8 h-8" />}
                                color="red"
                                description={t('cancelled')}
                            />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Interface complète pour administrateur
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('dashboard')} - {t('completeAdministration')}
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Message */}
                    <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                        <h1 className="text-2xl font-bold mb-2">
                            🎯 {t('adminDashboard')}
                        </h1>
                        <p className="text-blue-100">
                            {t('completeOverview')}
                        </p>
                    </div>

                    {/* Statistiques des Utilisateurs */}
                    <div className="mb-6 sm:mb-8">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 px-4 sm:px-0">
                            👥 {t('userStatistics')}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <StatCard
                                title={t('totalUsers')}
                                value={stats.total_users}
                                icon={<UserGroupIcon className="w-8 h-8" />}
                                color="blue"
                                description={t('allUsers')}
                            />
                            <StatCard
                                title={t('activeUsers')}
                                value={stats.active_users}
                                icon={<CheckCircleIcon className="w-8 h-8" />}
                                color="green"
                                description={t('nonBlockedUsers')}
                            />
                            <StatCard
                                title={t('blockedUsers')}
                                value={stats.blocked_users}
                                icon={<XCircleIcon className="w-8 h-8" />}
                                color="red"
                                description={t('blockedUsers')}
                            />
                        </div>
                    </div>

                    {/* Statistiques des Produits et Catalogue */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            📦 {t('catalogAndProducts')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <StatCard
                                title={t('productTypes')}
                                value={stats.total_type_produits}
                                icon={<TagIcon className="w-8 h-8" />}
                                color="purple"
                                description={t('availableCategories')}
                            />
                            <StatCard
                                title={t('paymentMethods')}
                                value={stats.total_payment_methods}
                                icon={<CreditCardIcon className="w-8 h-8" />}
                                color="indigo"
                                description={t('paymentMethodsAvailable')}
                            />
                            <StatCard
                                title={t('totalProducts')}
                                value={stats.total_products}
                                icon={<CubeIcon className="w-8 h-8" />}
                                color="cyan"
                                description={t('totalProductsInCatalog')}
                            />
                        </div>

                        {/* Détails Types de Produits */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        📋 {t('productTypesAndNumbers')}
                                    </h4>
                                </div>
                                <div className="p-6">
                                    {stats.type_produits_details && stats.type_produits_details.length > 0 ? (
                                        <div className="space-y-3">
                                            {stats.type_produits_details.map((type) => (
                                                <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <span className="font-medium text-gray-900 dark:text-white">{type.name}</span>
                                                    <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-sm font-semibold">
                                                        {type.produits_count} {t('products')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">{t('noProductTypesFound')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Détails Méthodes de Paiement */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        💳 {t('paymentMethodsAndProducts')}
                                    </h4>
                                </div>
                                <div className="p-6">
                                    {stats.payment_methods_details && stats.payment_methods_details.length > 0 ? (
                                        <div className="space-y-3">
                                            {stats.payment_methods_details.map((method) => (
                                                <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                                                        {method.methode_name.replace('_', ' ')}
                                                    </span>
                                                    <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded-full text-sm font-semibold">
                                                        {method.products_count} {t('products')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">{t('noPaymentMethodsFound')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques des Commandes */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            🛒 {t('orderStatistics')}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard
                                title={t('totalOrders')}
                                value={stats.total_orders}
                                icon={<ShoppingCartIcon className="w-8 h-8" />}
                                color="blue"
                                description={t('allOrders')}
                            />
                            <StatCard
                                title={t('pending')}
                                value={stats.pending_orders}
                                icon={<ClockIcon className="w-8 h-8" />}
                                color="yellow"
                                description={t('toProcess')}
                            />
                            <StatCard
                                title={t('confirmed')}
                                value={stats.confirmed_orders}
                                icon={<CheckIcon className="w-8 h-8" />}
                                color="green"
                                description={t('confirmed')}
                            />
                            <StatCard
                                title={t('cancelled')}
                                value={stats.cancelled_orders}
                                icon={<XMarkIcon className="w-8 h-8" />}
                                color="red"
                                description={t('cancelled')}
                            />
                        </div>
                    </div>

                    {/* Graphiques */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartCard
                            title={`📊 ${t('productPricesHighToLow')}`}
                            data={stats.product_prices_chart}
                        />
                        <ChartCard
                            title={`👨‍💼 ${t('ordersByUser')}`}
                            data={stats.orders_by_user_chart}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}