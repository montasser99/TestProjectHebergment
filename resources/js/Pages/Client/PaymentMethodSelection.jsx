import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    CreditCardIcon, 
    BanknotesIcon,
    DevicePhoneMobileIcon,
    BuildingLibraryIcon,
    CurrencyDollarIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function PaymentMethodSelection({ priceMethodes, totalProducts }) {
    const { t } = useTranslation();
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Animation d'entrée
    useEffect(() => {
        setIsAnimating(true);
    }, []);

    // Icônes pour les méthodes de paiement
    const getMethodIcon = (methodName) => {
        const name = methodName.toLowerCase();
        if (name.includes('d17')) return DevicePhoneMobileIcon;
        if (name.includes('carte') || name.includes('card')) return CreditCardIcon;
        if (name.includes('paypal')) return CurrencyDollarIcon;
        if (name.includes('virement') || name.includes('bank')) return BuildingLibraryIcon;
        if (name.includes('espece') || name.includes('cash')) return BanknotesIcon;
        return CreditCardIcon;
    };

    // Couleurs pour les méthodes
    const getMethodColor = (methodName) => {
        const name = methodName.toLowerCase();
        if (name.includes('d17')) return 'from-orange-500 to-red-500';
        if (name.includes('ooredoo')) return 'from-red-500 to-pink-500';
        if (name.includes('orange')) return 'from-orange-500 to-yellow-500';
        if (name.includes('paypal')) return 'from-blue-500 to-indigo-500';
        if (name.includes('virement')) return 'from-green-500 to-emerald-500';
        if (name.includes('espece')) return 'from-gray-500 to-slate-500';
        return 'from-blue-500 to-purple-500';
    };

    const handleMethodSelect = (method) => {
        setSelectedMethod(method);
        
        // Stocker dans localStorage
        localStorage.setItem('selectedPaymentMethod', JSON.stringify({
            id: method.id,
            name: method.methode_name
        }));

        // Rediriger vers le catalogue après une petite animation
        setTimeout(() => {
            router.visit(`/client/products?payment_method_id=${method.id}`);
        }, 500);
    };

    return (
        <>
            <Head title={t('selectPaymentMethod')} />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-colors duration-300">
                {/* Header avec logo */}
                <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-3">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">AS</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        AMAZIGHI SHOP
                                    </h1>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('welcomeToStore')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Titre et description */}
                    <div className={`text-center mb-12 transform transition-all duration-1000 ${
                        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('choosePaymentMethod')} 
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"></span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            {t('selectPaymentMethodDesc')}
                        </p>
                    </div>

                    {/* Message informatif */}
                    {totalProducts > 0 && (
                        <div className={`text-center mb-8 transform transition-all duration-1000 delay-300 ${
                            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 max-w-2xl mx-auto">
                                <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    {priceMethodes.length > 0 ? t('methodsAvailableForAllProducts') : t('noMethodsAvailable')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Grille des méthodes de paiement */}
                    {priceMethodes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {priceMethodes.map((method, index) => {
                            const IconComponent = getMethodIcon(method.methode_name);
                            const gradientColor = getMethodColor(method.methode_name);
                            const isSelected = selectedMethod?.id === method.id;

                            return (
                                <div
                                    key={method.id}
                                    className={`transform transition-all duration-500 ${
                                        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                    }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <button
                                        onClick={() => handleMethodSelect(method)}
                                        className={`group relative w-full p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                                            isSelected
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/50 scale-105 shadow-2xl'
                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                        disabled={isSelected}
                                    >
                                        {/* Effet de background animé */}
                                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                                        
                                        {/* Icône */}
                                        <div className={`relative mb-6 mx-auto w-16 h-16 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                                            <IconComponent className="h-8 w-8 text-white" />
                                        </div>

                                        {/* Nom de la méthode */}
                                        <h3 className="relative text-xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
                                            {method.methode_name.replace('_', ' ')}
                                        </h3>

                                        {/* Description */}
                                        <p className="relative text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                                            {t('paymentMethodAvailable')} {method.methode_name.replace('_', ' ')}
                                        </p>

                                        {/* Bouton d'action */}
                                        <div className={`relative flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                                            isSelected
                                                ? 'text-blue-600 dark:text-blue-400'
                                                : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                        }`}>
                                            {isSelected ? (
                                                <span className="flex items-center">
                                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                                    </div>
                                                    {t('loadingProducts')}
                                                </span>
                                            ) : (
                                                <span className="flex items-center group-hover:translate-x-1 transition-transform duration-300">
                                                    {t('selectMethod')}
                                                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                                                </span>
                                            )}
                                        </div>

                                        {/* Animation de sélection */}
                                        {isSelected && (
                                            <div className="absolute inset-0 rounded-2xl border-2 border-blue-500 animate-pulse"></div>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                        </div>
                    ) : (
                        /* Message si aucune méthode disponible */
                        <div className={`text-center transform transition-all duration-1000 delay-300 ${
                            isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                        }`}>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-12 max-w-2xl mx-auto">
                                <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {t('noMethodsAvailable')}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t('contactAdminForPaymentMethods')}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Informations supplémentaires */}
                    {priceMethodes.length > 0 && (
                    <div className={`text-center transform transition-all duration-1000 delay-500 ${
                        isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-3">
                                        <CreditCardIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{t('securePaymentGuaranteed')}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Toutes vos transactions sont protégées</p>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-3">
                                        <BanknotesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Prix transparents</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Pas de frais cachés, prix clairs</p>
                                </div>
                                
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-3">
                                        <DevicePhoneMobileIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Support client</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Assistance 24/7 pour vos commandes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </div>

                {/* Effet de particules en arrière-plan */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </>
    );
}