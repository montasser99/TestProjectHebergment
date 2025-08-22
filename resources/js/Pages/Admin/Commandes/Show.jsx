import AuthenticatedLayoutAdmin from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import {
    ArrowLeftIcon,
    CheckIcon,
    XCircleIcon,
    ClockIcon,
    UserIcon,
    CreditCardIcon,
    ShoppingCartIcon,
    DocumentTextIcon,
    CalendarIcon,
    PencilIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

export default function Show({ commande }) {
    const { t } = useTranslation();
    const [notesAdmin, setNotesAdmin] = useState(commande.notes_admin || '');
    const [showNotesEdit, setShowNotesEdit] = useState(false);

    // Couleurs de statut
    const getStatutColor = (statut) => {
        switch (statut) {
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
            case 'confirme':
                return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
            case 'annuler':
                return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700';
        }
    };

    // Icône de statut
    const getStatutIcon = (statut) => {
        switch (statut) {
            case 'en_attente':
                return <ClockIcon className="h-6 w-6" />;
            case 'confirme':
                return <CheckIcon className="h-6 w-6" />;
            case 'annuler':
                return <XCircleIcon className="h-6 w-6" />;
            default:
                return <DocumentTextIcon className="h-6 w-6" />;
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

    // Confirmer commande
    const handleConfirm = () => {
        if (confirm(t('confirmOrderConfirmation'))) {
            router.post(`/admin/commandes/${commande.id}/confirm`, {
                notes_admin: notesAdmin
            });
        }
    };

    // Annuler commande
    const handleCancel = () => {
        if (confirm(t('confirmOrderCancellation'))) {
            router.post(`/admin/commandes/${commande.id}/cancel`, {
                notes_admin: notesAdmin
            });
        }
    };

    // Sauvegarder notes
    const handleSaveNotes = () => {
        router.put(`/admin/commandes/${commande.id}/notes`, {
            notes_admin: notesAdmin
        }, {
            onSuccess: () => {
                setShowNotesEdit(false);
            }
        });
    };

    return (
        <AuthenticatedLayoutAdmin
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/admin/commandes"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <ArrowLeftIcon className="h-6 w-6" />
                        </Link>
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                {t('order')} #{commande.id}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {t('orderDetails')}
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`${t('order')} #${commande.id} - Admin`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Colonne principale */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Informations générales */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                        <DocumentTextIcon className="h-5 w-5 mr-2" />
                                        {t('orderInformation')}
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('orderNumber')}
                                            </label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                                #{commande.id}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('status')}
                                            </label>
                                            <div className="mt-1">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatutColor(commande.statut)}`}>
                                                    {getStatutIcon(commande.statut)}
                                                    <span className="ml-2">{getStatutText(commande.statut)}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('orderDate')}
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                                                <CalendarIcon className="h-4 w-4 mr-2" />
                                                {new Date(commande.date_commande).toLocaleString()}
                                            </p>
                                        </div>
                                        {commande.date_confirmation && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t('confirmationDate')}
                                                </label>
                                                <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                                    {new Date(commande.date_confirmation).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('paymentMethod')}
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white flex items-center">
                                                <CreditCardIcon className="h-4 w-4 mr-2" />
                                                {commande.payment_method_name}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('totalAmount')}
                                            </label>
                                            <p className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">
                                                {commande.total_amount} TND
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Produits commandés */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                        {t('orderedProducts')} ({commande.commande_produits?.length || 0})
                                    </h3>
                                </div>
                                <div className="p-6">
                                    {commande.commande_produits && commande.commande_produits.length > 0 ? (
                                        <div className="space-y-4">
                                            {commande.commande_produits.map((produit, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <div className="flex items-center space-x-4">
                                                        {produit.produit_image ? (
                                                            <img
                                                                src={`/storage/${produit.produit_image}`}
                                                                alt={produit.produit_label}
                                                                className="w-16 h-16 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                                                                <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                                {produit.produit_label}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {produit.quantite_commandee} × {produit.prix_unitaire} TND
                                                            </p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                                {produit.produit_quantity} {produit.produit_unit} • {produit.produit_currency}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {produit.sous_total} TND
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400">{t('noProductsInOrder')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Colonne latérale */}
                        <div className="space-y-6">
                            {/* Informations client */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                        <UserIcon className="h-5 w-5 mr-2" />
                                        {t('customerInformation')}
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('name')}
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {commande.user?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('email')}
                                        </label>
                                        <p className="mt-1 text-gray-900 dark:text-white">
                                            {commande.user?.email}
                                        </p>
                                    </div>
                                    {commande.user?.phone && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {t('phone')}
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {commande.user.phone}
                                            </p>
                                        </div>
                                    )}
                                    {commande.client_facebook && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Facebook
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {commande.client_facebook}
                                            </p>
                                        </div>
                                    )}
                                    {commande.client_instagram && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Instagram
                                            </label>
                                            <p className="mt-1 text-gray-900 dark:text-white">
                                                {commande.client_instagram}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notes client */}
                            {commande.notes_client && (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                                            {t('customerNotes')}
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                            {commande.notes_client}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Notes admin */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                                            {t('adminNotes')}
                                        </h3>
                                        <button
                                            onClick={() => setShowNotesEdit(!showNotesEdit)}
                                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    {showNotesEdit ? (
                                        <div className="space-y-4">
                                            <textarea
                                                value={notesAdmin}
                                                onChange={(e) => setNotesAdmin(e.target.value)}
                                                placeholder={t('addAdminNotes')}
                                                className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                                            />
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={handleSaveNotes}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                >
                                                    {t('save')}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowNotesEdit(false);
                                                        setNotesAdmin(commande.notes_admin || '');
                                                    }}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                                                >
                                                    {t('cancel')}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            {commande.notes_admin ? (
                                                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                                    {commande.notes_admin}
                                                </p>
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-400 italic">
                                                    {t('noAdminNotes')}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayoutAdmin>
    );
}