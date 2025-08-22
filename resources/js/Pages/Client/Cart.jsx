import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayoutClient from '@/Layouts/Client/AuthenticatedLayoutClient';
import PaymentMethodGuard from '@/Utils/PaymentMethodGuard';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    ArrowLeftIcon,
    PlusIcon,
    MinusIcon,
    TrashIcon,
    ShoppingCartIcon,
    CreditCardIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Cart({ auth }) {
    const { t } = useTranslation();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    // Charger le panier depuis localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                // Corriger les anciens paniers sans subtotal
                const correctedCart = cartData.map(item => ({
                    ...item,
                    subtotal: item.subtotal || (parseFloat(item.price) || 0) * (item.quantity || 1)
                }));
                setCart(correctedCart);
                // Sauvegarder la version corrigée
                if (JSON.stringify(correctedCart) !== savedCart) {
                    localStorage.setItem('cart', JSON.stringify(correctedCart));
                }
            } catch (error) {
                console.error('Erreur lors du chargement du panier:', error);
                localStorage.removeItem('cart');
            }
        }
        setLoading(false);
    }, []);

    // Sauvegarder le panier dans localStorage
    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    // Mettre à jour la quantité d'un produit
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const newCart = cart.map(item => 
            item.id === productId 
                ? { ...item, quantity: newQuantity, subtotal: (parseFloat(item.price) || 0) * newQuantity }
                : item
        );
        saveCart(newCart);
        instantToast.success(t('cartUpdated'));
    };

    // Supprimer un produit du panier
    const removeFromCart = (productId) => {
        const newCart = cart.filter(item => item.id !== productId);
        saveCart(newCart);
        instantToast.success(t('productRemovedFromCart'));
    };

    // Vider le panier
    const clearCart = () => {
        instantToast.confirm({
            title: t('clearCart'),
            message: t('confirmClearCart'),
            confirmText: t('clear'),
            cancelText: t('cancel'),
            variant: 'danger',
            onConfirm: () => {
                saveCart([]);
                instantToast.success(t('cartCleared'));
            }
        });
    };

    // Calculer le total
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0);

    // Procéder au checkout
    const proceedToCheckout = () => {
        if (cart.length === 0) {
            instantToast.error(t('cartIsEmpty'));
            return;
        }

        // Récupérer la méthode de paiement depuis localStorage
        const paymentMethod = localStorage.getItem('selectedPaymentMethod');
        if (!paymentMethod) {
            instantToast.error(t('pleaseSelectPaymentMethod'));
            router.visit('/client/payment-method');
            return;
        }

        const paymentMethodData = JSON.parse(paymentMethod);
        router.visit(`/checkout?payment_method_id=${paymentMethodData.id}`);
    };

    if (loading) {
        return (
            <AuthenticatedLayoutClient
                header={<h2 className="text-xl font-semibold">{t('cart')}</h2>}
            >
                <Head title={t('cart')} />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
                    </div>
                </div>
            </AuthenticatedLayoutClient>
        );
    }

    return (
        <PaymentMethodGuard>
            <AuthenticatedLayoutClient
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/client/products"
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                            onClick={(e) => {
                                const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
                                if (savedPaymentMethod) {
                                    const paymentMethod = JSON.parse(savedPaymentMethod);
                                    e.preventDefault();
                                    router.visit(`/client/products?payment_method_id=${paymentMethod.id}`);
                                }
                            }}
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {t('cart')} ({cart.length})
                        </h2>
                    </div>
                    {cart.length > 0 && (
                        <button
                            onClick={clearCart}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                        >
                            {t('clearCart')}
                        </button>
                    )}
                </div>
            }
        >
            <Head title={t('cart')} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {cart.length === 0 ? (
                        // Panier vide
                        <div className="text-center py-16">
                            <ShoppingCartIcon className="h-24 w-24 mx-auto text-gray-400 mb-6" />
                            <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
                                {t('cartIsEmpty')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">
                                {t('cartEmptyDescription')}
                            </p>
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
                                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                {t('continueShopping')}
                            </button>
                        </div>
                    ) : (
                        // Panier avec produits
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Liste des produits */}
                            <div className="lg:col-span-2">
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                            <div className="flex items-center space-x-4">
                                                {/* Image du produit */}
                                                <div className="flex-shrink-0">
                                                    {item.image ? (
                                                        <img
                                                            src={`/storage/${item.image}`}
                                                            alt={item.label}
                                                            className="h-20 w-20 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                                            <PhotoIcon className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Détails du produit */}
                                                <div className="flex-grow">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                        {item.label}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {item.quantity} {item.unit}
                                                    </p>
                                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                        {(parseFloat(item.price) || 0).toFixed(3)} TND
                                                    </p>
                                                </div>

                                                {/* Contrôles de quantité */}
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                    >
                                                        <MinusIcon className="h-4 w-4" />
                                                    </button>
                                                    
                                                    <span className="w-8 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                    >
                                                        <PlusIcon className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Sous-total et supprimer */}
                                                <div className="text-right">
                                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {(parseFloat(item.subtotal) || 0).toFixed(3)} TND
                                                    </p>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="mt-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Résumé de commande */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-6">
                                    <div className="p-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                            <CreditCardIcon className="h-5 w-5 mr-2" />
                                            {t('orderSummary')}
                                        </h3>
                                        
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {t('itemsCount', { count: cart.length })}
                                                </span>
                                                <span className="text-gray-900 dark:text-white">
                                                    {(total || 0).toFixed(3)} TND
                                                </span>
                                            </div>
                                            
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                                <div className="flex justify-between">
                                                    <span className="text-base font-medium text-gray-900 dark:text-white">
                                                        {t('total')}
                                                    </span>
                                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                        {(total || 0).toFixed(3)} TND
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={proceedToCheckout}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <CreditCardIcon className="h-5 w-5 mr-2" />
                                            {t('proceedToCheckout')}
                                        </button>

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
                                            className="mt-3 w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                                            {t('continueShopping')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </AuthenticatedLayoutClient>
        </PaymentMethodGuard>
    );
}