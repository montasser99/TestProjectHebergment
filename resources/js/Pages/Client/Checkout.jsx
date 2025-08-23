import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayoutClient from '@/Layouts/Client/AuthenticatedLayoutClient';
import PaymentMethodGuard from '@/Utils/PaymentMethodGuard';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
    ArrowLeftIcon,
    CheckIcon,
    UserIcon,
    CreditCardIcon,
    ClipboardDocumentListIcon,
    ShoppingBagIcon
} from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Checkout({ auth, selectedPaymentMethod, paymentMethodId }) {
    const { t } = useTranslation();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        payment_method_id: paymentMethodId,
        client_facebook: '',
        client_instagram: '',
        notes_client: '',
        cart_items: [],
    });

    // Charger le panier depuis localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            setCart(cartData);
            
            const totalAmount = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            setTotal(totalAmount);
            
            // Préparer les données pour la commande
            const cartItems = cartData.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));
            setData('cart_items', cartItems);
        }
    }, []);

    const steps = [
        { id: 1, name: t('contactInformation'), icon: UserIcon },
        { id: 2, name: t('verifyOrder'), icon: ClipboardDocumentListIcon },
        { id: 3, name: t('finalizeOrder'), icon: CheckIcon },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            instantToast.error(t('yourCartIsEmpty'));
            return;
        }

        post(route('client.orders.store'), {
            onSuccess: () => {
                // Vider le panier après succès
                localStorage.removeItem('cart');
                instantToast.success(t('orderPlacedSuccessfully'));
            },
            onError: (errors) => {
                if (errors.contact) {
                    instantToast.error(errors.contact);
                } else {
                    instantToast.error(t('orderCreationError'));
                }
            }
        });
    };

    const nextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <PaymentMethodGuard selectedPaymentMethod={selectedPaymentMethod}>
            <AuthenticatedLayoutClient
            header={
                <div className="flex items-center space-x-4">
                    <Link
                        href="/cart"
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('finalizingOrder')}
                    </h2>
                </div>
            }
        >
            <Head title={t('checkout')} />

            <div className="py-6 sm:py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Stepper - Version mobile simplifiée */}
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center justify-center">
                            {steps.map((step, stepIdx) => (
                                <div key={step.id} className="flex items-center">
                                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                                        currentStep >= step.id
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'border-gray-300 text-gray-400'
                                    }`}>
                                        {currentStep > step.id ? (
                                            <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        ) : (
                                            <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        )}
                                    </div>
                                    {stepIdx < steps.length - 1 && (
                                        <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                                            currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* Labels en dessous pour mobile */}
                        <div className="flex justify-between mt-3 px-2 sm:hidden">
                            {steps.map((step) => (
                                <span 
                                    key={step.id} 
                                    className={`text-xs text-center ${currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-400'}`}
                                    style={{ width: '30%' }}
                                >
                                    {step.name}
                                </span>
                            ))}
                        </div>
                        {/* Labels normaux pour desktop */}
                        <div className="hidden sm:flex items-center justify-center mt-3">
                            {steps.map((step, stepIdx) => (
                                <div key={step.id} className="flex items-center">
                                    <span className={`text-sm font-medium ${
                                        currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                                    }`}>
                                        {step.name}
                                    </span>
                                    {stepIdx < steps.length - 1 && (
                                        <div className="w-16 mx-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Formulaire principal */}
                            <div className="w-full lg:w-2/3">
                                {/* Étape 1: Informations de contact */}
                                {currentStep === 1 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="p-4 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                                                {t('contactInformation')}
                                            </h3>
                                            
                                            <div className="space-y-4 sm:space-y-6 max-w-md mx-auto">
                                                <div>
                                                    <label htmlFor="client_facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t('facebookPageOptional')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="client_facebook"
                                                        value={data.client_facebook}
                                                        onChange={(e) => setData('client_facebook', e.target.value)}
                                                        placeholder="votre.page.facebook"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                                                    />
                                                    {errors.client_facebook && (
                                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.client_facebook}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="client_instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t('instagramOptional')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="client_instagram"
                                                        value={data.client_instagram}
                                                        onChange={(e) => setData('client_instagram', e.target.value)}
                                                        placeholder="@votre_instagram"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                                                    />
                                                    {errors.client_instagram && (
                                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.client_instagram}</p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label htmlFor="notes_client" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {t('additionalNotes')}
                                                    </label>
                                                    <textarea
                                                        id="notes_client"
                                                        value={data.notes_client}
                                                        onChange={(e) => setData('notes_client', e.target.value)}
                                                        rows="3"
                                                        placeholder={t('specialInstructions')}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm sm:text-base"
                                                    />
                                                    {errors.notes_client && (
                                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.notes_client}</p>
                                                    )}
                                                </div>

                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                                                    <div className="flex">
                                                        <div className="flex-shrink-0">
                                                            <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-400 mt-0.5" />
                                                        </div>
                                                        <div className="ml-3">
                                                            <h3 className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-200">
                                                                {t('importantInformation')}
                                                            </h3>
                                                            <div className="mt-1 text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                                                                <p>{t('pleaseProvideContact')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-6 flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                                >
                                                    {t('continue')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Étape 2: Vérification */}
                                {currentStep === 2 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="p-4 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                                                {t('checkYourOrder')}
                                            </h3>
                                            
                                            {/* Informations de contact */}
                                            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg max-w-md mx-auto">
                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-center text-sm sm:text-base">{t('contactInformation')}</h4>
                                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                    {data.client_facebook && (
                                                        <p className="truncate"><strong>Facebook:</strong> {data.client_facebook}</p>
                                                    )}
                                                    {data.client_instagram && (
                                                        <p className="truncate"><strong>Instagram:</strong> {data.client_instagram}</p>
                                                    )}
                                                    {data.notes_client && (
                                                        <p className="truncate"><strong>Notes:</strong> {data.notes_client}</p>
                                                    )}
                                                    {!data.client_facebook && !data.client_instagram && !data.notes_client && (
                                                        <p className="text-center text-gray-500">{t('noContactInformation')}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Produits dans la commande */}
                                            <div className="space-y-3 sm:space-y-4 max-w-md mx-auto">
                                                <h4 className="font-medium text-gray-900 dark:text-white text-center text-sm sm:text-base">{t('orderedProducts')}</h4>
                                                {cart.map((item) => (
                                                    <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                                                {item.image ? (
                                                                    <img
                                                                        src={`/storage/${item.image}`}
                                                                        alt={item.label}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <ShoppingBagIcon className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <h5 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{item.label}</h5>
                                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                                    {t('quantity')}: {item.quantity}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right ml-2 flex-shrink-0">
                                                            <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base whitespace-nowrap">
                                                                {(item.price * item.quantity).toFixed(3)} {item.currency}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="mt-6 flex justify-center space-x-3 sm:space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                                >
                                                    {t('back')}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                                >
                                                    {t('confirm')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Étape 3: Confirmation */}
                                {currentStep === 3 && (
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                        <div className="p-4 sm:p-6">
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                                                {t('finalizeOrder')}
                                            </h3>
                                            
                                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 max-w-md mx-auto">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-400 mt-0.5" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-200">
                                                            {t('readyToOrder')}
                                                        </h3>
                                                        <div className="mt-1 text-xs sm:text-sm text-green-700 dark:text-green-300">
                                                            <p>{t('orderWillBeProcessed')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex justify-center space-x-3 sm:space-x-4">
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                                                >
                                                    {t('back')}
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-8 sm:py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                                >
                                                    {processing ? t('processing') : t('placeOrder')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar résumé de commande */}
                            <div className="w-full lg:w-1/3">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 lg:sticky lg:top-6">
                                    <div className="p-4 sm:p-6">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
                                            <CreditCardIcon className="h-5 w-5 mr-2" />
                                            {t('orderSummary')}
                                        </h3>
                                        
                                        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">{t('itemsCount', { count: cart.length })}</span>
                                                <span className="text-gray-900 dark:text-white">{total.toFixed(3)} TND</span>
                                            </div>
                                            
                                            {selectedPaymentMethod && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">{t('paymentMethodText')}</span>
                                                    <span className="text-gray-900 dark:text-white capitalize">
                                                        {selectedPaymentMethod.methode_name.replace('_', ' ')}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            <div className="border-t border-gray-200 dark:border-gray-600 pt-2 sm:pt-3">
                                                <div className="flex justify-between text-base sm:text-lg font-bold">
                                                    <span className="text-gray-900 dark:text-white">{t('total')}</span>
                                                    <span className="text-green-600 dark:text-green-400">{total.toFixed(3)} TND</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                                                {t('itemsCount', { count: cart.length })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            </AuthenticatedLayoutClient>
        </PaymentMethodGuard>
    );
}