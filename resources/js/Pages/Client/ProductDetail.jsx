import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayoutClient from '@/Layouts/Client/AuthenticatedLayoutClient';
import PaymentMethodGuard from '@/Utils/PaymentMethodGuard';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    ArrowLeftIcon,
    PlusIcon,
    MinusIcon,
    ShoppingCartIcon,
    PhotoIcon,
    CubeIcon,
    TagIcon,
    ChatBubbleLeftIcon,
    CheckIcon
} from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function ProductDetail({ auth, produit, selectedPaymentMethod, paymentMethodId }) {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    // Charger le panier depuis localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            setCart(cartData);
            setCartCount(cartData.reduce((sum, item) => sum + item.quantity, 0));
        }
    }, []);

    // Récupérer le prix selon la méthode de paiement ou le premier prix disponible
    const getPrice = () => {
        if (produit.produit_prices && produit.produit_prices.length > 0) {
            return parseFloat(produit.produit_prices[0].price || 0);
        }
        return 0;
    };
    
    const price = getPrice();
    const availableContacts = produit.contact_social_media ? 
        Object.entries(produit.contact_social_media)
            .filter(([key, value]) => value && key !== 'id' && key !== 'id_produit' && key !== 'created_at' && key !== 'updated_at')
            .map(([key, value]) => ({ type: key, value })) : [];

    const getContactLabel = (type) => {
        switch (type) {
            case 'instagram_page': return 'Instagram';
            case 'facebook_page': return 'Facebook';
            case 'whatsapp_number': return 'WhatsApp';
            case 'tiktok_page': return 'TikTok';
            default: return type;
        }
    };

    const getContactIcon = (type) => {
        const baseClasses = "w-5 h-5 text-white";
        switch (type) {
            case 'instagram_page': return <span className={baseClasses}>📷</span>;
            case 'facebook_page': return <span className={baseClasses}>📘</span>;
            case 'whatsapp_number': return <span className={baseClasses}>💬</span>;
            case 'tiktok_page': return <span className={baseClasses}>🎵</span>;
            default: return <ChatBubbleLeftIcon className={baseClasses} />;
        }
    };

    const getContactColor = (type) => {
        switch (type) {
            case 'instagram_page': return 'from-pink-500 to-purple-600';
            case 'facebook_page': return 'from-blue-600 to-blue-700';
            case 'whatsapp_number': return 'from-green-500 to-green-600';
            case 'tiktok_page': return 'from-gray-900 to-gray-800';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const addToCart = () => {
        const existingCartItem = cart.find(item => item.id === produit.id);
        let newCart;

        const productInfo = {
            id: produit.id,
            label: produit.label,
            description: produit.description,
            image: produit.image,
            quantity: produit.quantity,
            unit: produit.unit,
            currency: produit.currency,
            price: price,
            type_name: produit.type_produit?.name
        };

        if (existingCartItem) {
            newCart = cart.map(item =>
                item.id === produit.id
                    ? { 
                        ...item, 
                        quantity: item.quantity + quantity,
                        subtotal: (parseFloat(item.price) || 0) * (item.quantity + quantity)
                    }
                    : item
            );
        } else {
            newCart = [...cart, { 
                ...productInfo, 
                quantity: quantity,
                subtotal: price * quantity
            }];
        }

        setCart(newCart);
        setCartCount(newCart.reduce((sum, item) => sum + item.quantity, 0));
        localStorage.setItem('cart', JSON.stringify(newCart));
        
        instantToast.success(t('productAddedToCart'));
    };

    return (
        <PaymentMethodGuard selectedPaymentMethod={selectedPaymentMethod} strict={false}>
            <AuthenticatedLayoutClient
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
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
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {produit.label}
                        </h2>
                    </div>
                    
                    <button
                        onClick={() => router.visit('/cart')}
                        className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                        <ShoppingCartIcon className="h-5 w-5" />
                        <span>{t('cart')}</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            }
        >
            <Head title={produit.label} />

            <div className="py-4 sm:py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Image du produit */}
                        <div className="space-y-4">
                            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md max-w-md mx-auto lg:mx-0">
                                {produit.image ? (
                                    <img
                                        src={`/storage/${produit.image}`}
                                        alt={produit.label}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PhotoIcon className="h-16 w-16 text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Badge type de produit */}
                            {produit.type_produit && (
                                <div className="flex justify-center">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        <TagIcon className="h-3 w-3 mr-1" />
                                        {produit.type_produit.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Informations du produit */}
                        <div className="space-y-6">
                            {/* En-tête */}
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    {produit.label}
                                </h1>
                                
                                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center">
                                        <CubeIcon className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{produit.quantity} {produit.unit}</span>
                                    </div>
                                    {produit.currency && (
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium">{produit.currency}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Prix */}
                                {price > 0 ? (
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 sm:p-4 border border-green-200 dark:border-green-800">
                                        <div className="flex items-baseline space-x-2">
                                            <span className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                                                {price.toFixed(3)}
                                            </span>
                                            <span className="text-base sm:text-lg text-green-600 dark:text-green-400">
                                                {produit.currency || 'TND'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                                            Prix via {produit.produit_prices[0]?.price_methode?.methode_name?.replace('_', ' ') || selectedPaymentMethod?.methode_name?.replace('_', ' ') || 'Méthode standard'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                                        <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="font-semibold text-sm">
                                                    {t('noPriceForProductInPaymentMethod', { method: selectedPaymentMethod?.methode_name?.replace('_', ' ') || 'N/A' })}
                                                </p>
                                                <p className="text-xs mt-1 opacity-90">
                                                    Veuillez changer de méthode de paiement ou contacter le vendeur.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {produit.description && (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-base sm:text-md font-semibold text-gray-900 dark:text-white mb-2">
                                        {t('productDescription')}
                                    </h3>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {produit.description}
                                    </p>
                                </div>
                            )}

                            {/* Quantité et ajout au panier */}
                            {price > 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                                        {t('addToCart')}
                                    </h3>
                                    
                                    <div className="flex items-center space-x-3 mb-4">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('quantity')} :
                                        </span>
                                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                disabled={quantity <= 1}
                                            >
                                                <MinusIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            </button>
                                            <span className="px-3 py-2 text-center min-w-[50px] text-gray-900 dark:text-white font-medium">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <PlusIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-md font-semibold text-gray-900 dark:text-white">
                                            {t('total')} : {(price * quantity).toFixed(3)} {produit.currency || 'TND'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={addToCart}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                                    >
                                        <ShoppingCartIcon className="h-4 w-4" />
                                        <span>{t('addToCart')}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                                    <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                                        {t('addToCart')}
                                    </h3>
                                    <div className="text-center text-gray-500 dark:text-gray-400">
                                        <p className="text-sm mb-3">
                                            L'ajout au panier n'est pas disponible pour cette méthode de paiement.
                                        </p>
                                        <p className="text-xs">
                                            Changez de méthode ou contactez le vendeur pour plus d'informations.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Informations de contact */}
                            {availableContacts.length > 0 && (
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-3 sm:p-4 border border-blue-200 dark:border-blue-800">
                                    <h3 className="text-base sm:text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                        <ChatBubbleLeftIcon className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                        {t('contactInformationVendor')}
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {availableContacts.map((contact, index) => (
                                            <div key={index} className={`flex items-center p-3 sm:p-2 bg-gradient-to-r ${getContactColor(contact.type)} rounded-lg text-white shadow-sm hover:shadow-md transition-shadow`}>
                                                <div className="flex-shrink-0 mr-3 sm:mr-2">
                                                    {getContactIcon(contact.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium">
                                                        {getContactLabel(contact.type)}
                                                    </p>
                                                    <p className="text-xs opacity-90 truncate">
                                                        {contact.value}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-3 flex items-start space-x-2 text-xs text-blue-700 dark:text-blue-300">
                                        <CheckIcon className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <p>
                                            Ces informations de contact sont spécifiques à ce produit.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Informations supplémentaires */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-base sm:text-md font-semibold text-gray-900 dark:text-white mb-3">
                                    Informations du produit
                                </h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3 text-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                        <span className="text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">Type :</span>
                                        <span className="sm:ml-2 font-medium text-gray-900 dark:text-white">
                                            {produit.type_produit?.name || 'Non spécifié'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Unité :</span>
                                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                            {produit.unit}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Quantité :</span>
                                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                            {produit.quantity}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Devise :</span>
                                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                            {produit.currency || 'TND'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </AuthenticatedLayoutClient>
        </PaymentMethodGuard>
    );
}