import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import GuestHeader from '@/Components/GuestHeader';
import AuthenticatedLayoutClient from '@/Layouts/Client/AuthenticatedLayoutClient';
import {
    ShoppingBagIcon,
    TruckIcon,
    ShieldCheckIcon,
    StarIcon,
    ArrowRightIcon,
    PlayCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

export default function Welcome({ auth, selectedPaymentMethod }) {
    const { t, i18n } = useTranslation();
    const [isDark, setIsDark] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(selectedPaymentMethod);

    // Initialiser la langue depuis localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
        }
    }, []);

    // Récupérer la méthode de paiement depuis localStorage si non fournie
    useEffect(() => {
        if (!paymentMethod) {
            const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
            if (savedPaymentMethod) {
                try {
                    const parsedPaymentMethod = JSON.parse(savedPaymentMethod);
                    setPaymentMethod(parsedPaymentMethod);
                } catch (error) {
                    console.error('Error parsing payment method from localStorage:', error);
                }
            }
        }
    }, [paymentMethod]);

    // Gestion du logo selon le mode sombre
    useEffect(() => {
        const checkDarkMode = () => {
            const darkMode = localStorage.getItem('darkMode') === 'true' || 
                           document.documentElement.classList.contains('dark');
            setIsDark(darkMode);
        };

        checkDarkMode();

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    const features = [
        {
            icon: ShoppingBagIcon,
            title: t('qualityProducts'),
            description: t('qualityProductsDesc')
        },
        {
            icon: TruckIcon,
            title: t('directContact'),
            description: t('directContactDesc')
        },
        {
            icon: ShieldCheckIcon,
            title: t('personalizedService'),
            description: t('personalizedServiceDesc')
        }
    ];

    // Contenu principal de la page Welcome
    const welcomeContent = (
        <>
            <Head title={t('welcome')} />
            
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Text Content */}
                        <div className="text-center lg:text-left">
                            <div className="animate-fade-in-up">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        AMAZIGHI
                                    </span>
                                    <br />
                                    <span className="text-gray-800 dark:text-gray-200">SHOP</span>
                                </h1>
                            </div>
                            
                            <div className="animate-fade-in-up animation-delay-200">
                                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                                    {t('welcomeSubtitle')}
                                </p>
                            </div>

                            <div className="animate-fade-in-up animation-delay-400">
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center relative z-[20]">
                                    {!auth.user && (
                                        <>
                                            <Link
                                                href={route('register')}
                                                className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg pointer-events-auto"
                                            >
                                                {t('startShopping')}
                                                <ArrowRightIcon className="ml-2 h-5 w-5" />
                                            </Link>
                                            <Link
                                                href={route('login')}
                                                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 pointer-events-auto"
                                            >
                                                {t('login')}
                                            </Link>
                                        </>
                                    )}
                                    {auth.user && auth.user.role === 'client' && (
                                        <>
                                            {paymentMethod ? (
                                                <Link
                                                    href={`/client/products?payment_method_id=${paymentMethod.id}`}
                                                    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                                >
                                                    {t('viewCatalog')}
                                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                                </Link>
                                            ) : (
                                                <Link
                                                    href="/client/products"
                                                    className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                                >
                                                    Découvrir nos produits
                                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                                </Link>
                                            )}
                                        </>
                                    )}
                                    {auth.user && auth.user.role !== 'client' && (
                                        <Link
                                            href={route('dashboard')}
                                            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                                        >
                                            {t('goToDashboard')}
                                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right side - Logo with Animation */}
                        <div className="flex justify-center lg:justify-end pointer-events-none">
                            <div className="animate-fade-in-up animation-delay-600">
                                <div className="relative">
                                    {/* Background decoration */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full animate-pulse pointer-events-none"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-full animate-ping animation-delay-1000 pointer-events-none"></div>
                                    
                                    {/* Logo */}
                                    <div className="relative p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 cursor-pointer pointer-events-auto"
                                         onClick={() => setIsModalOpen(true)}>
                                        <img 
                                            src={isDark ? "/images/AMAZIGHI_SHOP_W.png" : "/images/AMAZIGHI_SHOP_D.png"}
                                            alt="Logo Amazighi Shop"
                                            className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain animate-float"
                                        />
                                        {/* Indicateur de clic */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/10 rounded-full pointer-events-none">
                                            <div className="bg-white/90 dark:bg-gray-800/90 rounded-full p-2">
                                                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating elements */}
                                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce animation-delay-2000 opacity-70 pointer-events-none"></div>
                                    <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-indigo-500 rounded-full animate-bounce animation-delay-3000 opacity-60 pointer-events-none"></div>
                                    <div className="absolute top-1/2 -right-8 w-4 h-4 bg-purple-500 rounded-full animate-pulse animation-delay-2500 opacity-50 pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section pour les clients connectés avec méthode sélectionnée */}
            {auth.user && auth.user.role === 'client' && paymentMethod && (
                <section className="py-8 px-4 sm:px-6 lg:px-8 bg-blue-50 dark:bg-blue-900/20">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {t('selectedPaymentMethod')}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {t('youHaveChosen')} : <span className="font-bold text-blue-600 dark:text-blue-400 capitalize">
                                    {(paymentMethod?.methode_name || paymentMethod?.name)?.replace('_', ' ') || t('notSpecified')}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('catalogAvailableWithPrices')}
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('whyChooseUs')}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            {t('whyChooseUsDesc')}
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                                style={{ animationDelay: `${index * 200 + 600}ms` }}
                            >
                                <div className="animate-fade-in-up">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        <div className="animate-fade-in-up animation-delay-800">
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                2025
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                                {t('launchYear')}
                            </div>
                        </div>
                        <div className="animate-fade-in-up animation-delay-1000">
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                100%
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                                {t('authentic')}
                            </div>
                        </div>
                        <div className="animate-fade-in-up animation-delay-1200">
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                24/7
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                                {t('support')}
                            </div>
                        </div>
                        <div className="animate-fade-in-up animation-delay-1400">
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                {t('newLabel')}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">
                                {t('freshStart')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Process Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="animate-fade-in-up animation-delay-1400">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('paymentProcess')}
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                {t('paymentProcessDesc')}
                            </p>
                        </div>
                    </div>

                    {/* Process Steps */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {[
                            { title: t('step1Title'), desc: t('step1Desc'), icon: '1', color: 'blue' },
                            { title: t('step2Title'), desc: t('step2Desc'), icon: '2', color: 'green' },
                            { title: t('step3Title'), desc: t('step3Desc'), icon: '3', color: 'purple' },
                            { title: t('step4Title'), desc: t('step4Desc'), icon: '4', color: 'orange' }
                        ].map((step, index) => (
                            <div key={index} className={`text-center animate-fade-in-up animation-delay-${1400 + (index * 200)}`}>
                                <div className={`w-16 h-16 bg-${step.color}-100 dark:bg-${step.color}-900 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <span className={`text-2xl font-bold text-${step.color}-600 dark:text-${step.color}-400`}>
                                        {step.icon}
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Payment Methods */}
                    <div className="text-center">
                        <div className="animate-fade-in-up animation-delay-2000">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                {t('availablePaymentMethods')}
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                                {[
                                    { name: t('ooredooCard'), color: 'red', bgColor: 'red-50 dark:bg-red-900/20' },
                                    { name: t('d17Card'), color: 'blue', bgColor: 'blue-50 dark:bg-blue-900/20' },
                                    { name: t('posteTunisieCard'), color: 'yellow', bgColor: 'yellow-50 dark:bg-yellow-900/20' },
                                    { name: t('otherMethods'), color: 'gray', bgColor: 'gray-50 dark:bg-gray-700' }
                                ].map((method, index) => (
                                    <div key={index} className={`p-6 rounded-xl border-2 border-${method.color}-200 dark:border-${method.color}-700 bg-${method.bgColor} transition-all duration-300 hover:shadow-lg`}>
                                        <div className={`w-12 h-12 bg-${method.color}-100 dark:bg-${method.color}-900 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                                            <svg className={`w-6 h-6 text-${method.color}-600 dark:text-${method.color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            {method.name}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="animate-fade-in-up animation-delay-1600">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {t('contactUs')}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            {t('contactUsDesc')}
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            {/* WhatsApp / Phone */}
                            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('phoneWhatsApp')}</h3>
                                <a href="tel:28638936" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                    28 638 936
                                </a>
                            </div>

                            {/* Email */}
                            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                                <a href="mailto:amazighishoop@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                    amazighishoop@gmail.com
                                </a>
                            </div>

                            {/* Instagram */}
                            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instagram</h3>
                                <a href="https://www.instagram.com/amazighi_shop/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                    @amazighi_shop
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!auth.user && (
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
                            <div className="animate-fade-in-up animation-delay-1600">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                    {t('readyToStart')}
                                </h2>
                                <p className="text-xl mb-8 opacity-90">
                                    {t('readyToStartDesc')}
                                </p>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                                >
                                    {t('createAccount')}
                                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Image Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                     onClick={() => setIsModalOpen(false)}>
                    <div className="relative max-w-4xl max-h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
                         onClick={(e) => e.stopPropagation()}>
                        {/* Close button */}
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                        >
                            <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </button>
                        
                        {/* Image */}
                        <div className="p-6">
                            <img 
                                src={isDark ? "/images/AMAZIGHI_SHOP_W.png" : "/images/AMAZIGHI_SHOP_D.png"}
                                alt="Logo Amazighi Shop - Vue complète"
                                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
                            />
                        </div>
                        
                        {/* Caption */}
                        <div className="px-6 pb-6">
                            <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                                Logo AMAZIGHI SHOP - Cliquez en dehors pour fermer
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        © 2025 AMAZIGHI SHOP. {t('allRightsReserved')}
                    </p>
                </div>
            </footer>

            {/* Custom CSS for animations */}
            <style>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    33% {
                        transform: translateY(-10px) rotate(1deg);
                    }
                    66% {
                        transform: translateY(5px) rotate(-1deg);
                    }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                
                .animation-delay-200 { animation-delay: 0.2s; }
                .animation-delay-400 { animation-delay: 0.4s; }
                .animation-delay-600 { animation-delay: 0.6s; }
                .animation-delay-800 { animation-delay: 0.8s; }
                .animation-delay-1000 { animation-delay: 1.0s; }
                .animation-delay-1200 { animation-delay: 1.2s; }
                .animation-delay-1400 { animation-delay: 1.4s; }
                .animation-delay-1600 { animation-delay: 1.6s; }
                .animation-delay-2000 { animation-delay: 2.0s; }
                .animation-delay-2500 { animation-delay: 2.5s; }
                .animation-delay-3000 { animation-delay: 3.0s; }
            `}</style>
        </>
    );

    // Si l'utilisateur est connecté et est un client, utiliser le layout client
    if (auth.user && auth.user.role === 'client') {
        return (
            <AuthenticatedLayoutClient auth={auth}>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden w-full">
                    {welcomeContent}
                </div>
            </AuthenticatedLayoutClient>
        );
    }

    // Sinon (utilisateur non connecté ou autre rôle), utiliser le layout guest
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
            <GuestHeader auth={auth} />
            {welcomeContent}
        </div>
    );
}
