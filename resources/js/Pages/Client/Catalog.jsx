import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayoutClient from '@/Layouts/Client/AuthenticatedLayoutClient';
import PaymentMethodGuard from '@/Utils/PaymentMethodGuard';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
    PlusIcon,
    EyeIcon,
    ShoppingCartIcon,
    AdjustmentsHorizontalIcon,
    PhotoIcon,
    CubeIcon,
    TagIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Catalog({ auth, produits, typeProduits, priceRange, selectedPaymentMethod, filters }) {
    const { t } = useTranslation();
    
    // États pour les filtres
    const [search, setSearch] = useState(filters.search || '');
    const [selectedTypes, setSelectedTypes] = useState(
        filters.types ? filters.types.split(',').map(id => parseInt(id)) : []
    );
    const [minPrice, setMinPrice] = useState(filters.min_price || priceRange?.min_price || 0);
    const [maxPrice, setMaxPrice] = useState(filters.max_price || priceRange?.max_price || 100);
    const [showFilters, setShowFilters] = useState(false);
    
    // État du panier (stocké dans localStorage)
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    // Synchroniser les filtres avec les props quand la page change
    useEffect(() => {
        setSearch(filters.search || '');
        setSelectedTypes(filters.types ? filters.types.split(',').map(id => parseInt(id)) : []);
        setMinPrice(filters.min_price || priceRange?.min_price || 0);
        setMaxPrice(filters.max_price || priceRange?.max_price || 100);
    }, [filters, priceRange]);

    // Charger le panier depuis localStorage et vérifier la méthode de paiement
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            setCart(cartData);
            setCartCount(cartData.reduce((sum, item) => sum + item.quantity, 0));
        }

        // Vérifier si une méthode de paiement est sélectionnée
        const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
        if (!savedPaymentMethod && !selectedPaymentMethod) {
            router.visit('/client/payment-method');
        }
    }, [selectedPaymentMethod]);

    // Gérer l'ajout au panier (méthode simplifiée comme ProductDetail)
    const addToCart = (product) => {
        try {
            // Vérifier qu'il y a bien un prix pour la méthode sélectionnée
            if (!product.produit_prices || product.produit_prices.length === 0) {
                instantToast.error(t('priceNotAvailable'));
                return;
            }

            const price = parseFloat(product.produit_prices[0].price) || 0;
            
            // Créer les infos du produit
            const productInfo = {
                id: product.id,
                label: product.label,
                description: product.description,
                image: product.image,
                quantity: product.quantity,
                unit: product.unit,
                currency: product.currency,
                price: price,
                type_name: product.type_produit?.name
            };

            // Vérifier si le produit est déjà dans le panier
            const existingCartItem = cart.find(item => item.id === product.id);
            let newCart;

            if (existingCartItem) {
                // Augmenter la quantité
                newCart = cart.map(item =>
                    item.id === product.id
                        ? { 
                            ...item, 
                            quantity: item.quantity + 1,
                            subtotal: (parseFloat(item.price) || 0) * (item.quantity + 1)
                        }
                        : item
                );
            } else {
                // Ajouter le nouveau produit avec subtotal
                newCart = [...cart, { 
                    ...productInfo, 
                    quantity: 1,
                    subtotal: price * 1
                }];
            }

            setCart(newCart);
            setCartCount(newCart.reduce((sum, item) => sum + item.quantity, 0));
            localStorage.setItem('cart', JSON.stringify(newCart));
            
            instantToast.success(t('productAddedToCart'));
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
            instantToast.error(t('errorAddingToCart') + ': ' + (error.message || t('unknownError')));
        }
    };

    // Gérer les filtres par type (sélection multiple)
    const handleTypeFilter = (typeId) => {
        let newSelectedTypes;
        if (selectedTypes.includes(typeId)) {
            newSelectedTypes = selectedTypes.filter(id => id !== typeId);
        } else {
            newSelectedTypes = [...selectedTypes, typeId];
        }
        setSelectedTypes(newSelectedTypes);
    };

    // Appliquer les filtres
    const applyFilters = () => {
        const params = new URLSearchParams();
        params.append('payment_method_id', selectedPaymentMethod.id);
        
        if (search) params.append('search', search);
        if (selectedTypes.length > 0) params.append('types', selectedTypes.join(','));
        if (minPrice > (priceRange?.min_price || 0)) params.append('min_price', minPrice);
        if (maxPrice < (priceRange?.max_price || 100)) params.append('max_price', maxPrice);

        router.get(`/client/products?${params.toString()}`);
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearch('');
        setSelectedTypes([]);
        setMinPrice(priceRange?.min_price || 0);
        setMaxPrice(priceRange?.max_price || 100);
        
        router.get(`/client/products?payment_method_id=${selectedPaymentMethod.id}`);
    };

    // Changer de méthode de paiement
    const changePaymentMethod = () => {
        localStorage.removeItem('selectedPaymentMethod');
        localStorage.removeItem('cart');
        router.visit('/client/payment-method');
    };

    return (
        <PaymentMethodGuard selectedPaymentMethod={selectedPaymentMethod}>
            <AuthenticatedLayoutClient
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {t('catalog')} - {selectedPaymentMethod.methode_name.replace('_', ' ')}
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('selectPaymentMethodDesc')} {selectedPaymentMethod.methode_name}
                        </p>
                    </div>
                    
                    {/* Panier */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={changePaymentMethod}
                            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                        >
                            {t('selectMethod')}
                        </button>
                        
                        <Link
                            href="/cart"
                            className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <ShoppingCartIcon className="h-5 w-5" />
                            <span>{t('cart')}</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={t('catalog')} />

            <div className="py-6">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-6">
                        {/* Sidebar Filtres - Mini sidebar à gauche */}
                        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
                            showFilters ? 'w-80' : 'w-80 hidden lg:block'
                        }`}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                                        <FunnelIcon className="h-5 w-5 mr-2" />
                                        {t('filters')}
                                    </h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="lg:hidden text-gray-500 hover:text-gray-700"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Recherche */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t('search')}
                                    </label>
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder={t('searchProducts')}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Types de produits */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        {t('productTypes')}
                                    </label>
                                    <div className="space-y-2">
                                        {typeProduits.map((type) => (
                                            <label key={type.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTypes.includes(type.id)}
                                                    onChange={() => handleTypeFilter(type.id)}
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                                    {type.name}
                                                    <span className="text-gray-500 ml-1">({type.produits_count})</span>
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Fourchette de prix */}
                                {priceRange && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            {t('priceRange')} ({selectedPaymentMethod.methode_name})
                                        </label>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">{t('minPrice')}</label>
                                                <input
                                                    type="range"
                                                    min={priceRange.min_price}
                                                    max={priceRange.max_price}
                                                    step="0.1"
                                                    value={minPrice}
                                                    onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                                                    className="w-full"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{minPrice} TND</span>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">{t('maxPrice')}</label>
                                                <input
                                                    type="range"
                                                    min={priceRange.min_price}
                                                    max={priceRange.max_price}
                                                    step="0.1"
                                                    value={maxPrice}
                                                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                                                    className="w-full"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{maxPrice} TND</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Boutons d'action */}
                                <div className="space-y-3">
                                    <button
                                        onClick={applyFilters}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                                    >
                                        {t('applyFilters')}
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                                    >
                                        {t('clearFilters')}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Contenu principal */}
                        <div className="flex-1">
                            {/* Header mobile */}
                            <div className="lg:hidden mb-6 flex items-center justify-between">
                                <button
                                    onClick={() => setShowFilters(true)}
                                    className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                                >
                                    <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
                                    {t('filters')}
                                </button>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {produits.total} {t('noProductsFound')}
                                </span>
                            </div>

                            {/* Grille des produits */}
                            {produits.data.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                                    <CubeIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        {t('noProductsFound')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {t('tryDifferentFilters')}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-8">
                                        {produits.data.map((produit) => (
                                            <div key={produit.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                                                {/* Image */}
                                                <div className="h-56 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                                    {produit.image ? (
                                                        <img
                                                            src={`/storage/${produit.image}`}
                                                            alt={produit.label}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <PhotoIcon className="h-12 w-12 text-gray-400" />
                                                        </div>
                                                    )}
                                                    
                                                    {/* Badge type */}
                                                    <div className="absolute top-3 left-3">
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                            {produit.type_produit?.name}
                                                        </span>
                                                    </div>

                                                    {/* Actions overlay */}
                                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <Link
                                                            href={`/client/product/${produit.id}`}
                                                            className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                            title={t('viewDetails')}
                                                        >
                                                            <EyeIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Contenu */}
                                                <div className="p-3">
                                                    <div className="mb-2">
                                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">
                                                            {produit.label}
                                                        </h3>
                                                        <div className="flex items-center">
                                                            <CubeIcon className="h-3 w-3 text-gray-400 mr-1" />
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                {produit.quantity} {produit.unit}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Prix */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                                                {produit.produit_prices[0]?.price} TND
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                via {selectedPaymentMethod?.methode_name || 'N/A'}
                                                            </span>
                                                        </div>

                                                        {produit.contact_social_media && (
                                                            <div className="text-xs text-green-600 dark:text-green-400 flex items-center">
                                                                <TagIcon className="h-3 w-3 mr-1" />
                                                                {t('contactVendor')}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => addToCart(produit)}
                                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-2 rounded text-xs flex items-center justify-center space-x-1 transition-colors"
                                                        >
                                                            <PlusIcon className="h-3 w-3" />
                                                            <span>{t('addToCart')}</span>
                                                        </button>
                                                        
                                                        <Link
                                                            href={`/client/product/${produit.id}`}
                                                            className="bg-gray-600 hover:bg-gray-700 text-white py-1.5 px-2 rounded flex items-center justify-center transition-colors"
                                                        >
                                                            <EyeIcon className="h-3 w-3" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Pagination - Déplacée à la fin de la page */}
                    {produits.data.length > 0 && produits.links && (
                        <div className="mt-8 bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 sm:px-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    {produits.prev_page_url && (
                                        <Link
                                            href={produits.prev_page_url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                        >
                                            Précédent
                                        </Link>
                                    )}
                                    {produits.next_page_url && (
                                        <Link
                                            href={produits.next_page_url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                        >
                                            Suivant
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Affichage de <span className="font-medium">{produits.from}</span> à{' '}
                                            <span className="font-medium">{produits.to}</span> sur{' '}
                                            <span className="font-medium">{produits.total}</span> résultats
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
            </AuthenticatedLayoutClient>
        </PaymentMethodGuard>
    );
}