import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import {
    HomeIcon,
    ShoppingCartIcon,
    ClockIcon,
    SunIcon,
    MoonIcon,
    LanguageIcon,
    Bars3Icon,
    XMarkIcon,
    CreditCardIcon,
} from '@heroicons/react/24/outline';

export default function AuthenticatedLayoutClient({ header, children }) {
    const user = usePage().props.auth.user;
    const { t, i18n } = useTranslation();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const { props } = usePage();

    // Gestion du mode sombre
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(savedDarkMode);
        if (savedDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Gestion des messages flash
    useEffect(() => {
        if (props.message) {
            toast.success(props.message);
        }
        if (props.error) {
            toast.error(props.error);
        }
        if (props.errors && Object.keys(props.errors).length > 0) {
            Object.values(props.errors).forEach(error => {
                if (Array.isArray(error)) {
                    error.forEach(msg => toast.error(msg));
                } else {
                    toast.error(error);
                }
            });
        }
    }, [props.message, props.error, props.errors]);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'ar', name: 'العربية', flag: '🇹🇳' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="relative z-50 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-8 sm:h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                                <Link href="/" className="ml-2 hidden sm:block">
                                    <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">AMAZIGHI SHOP</span>
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href="/" active={route().current('welcome')} className="relative z-50">
                                    <div className="flex items-center relative z-50">
                                        <HomeIcon className="h-4 w-4 mr-2 relative z-50" />
                                        {t('home')}
                                    </div>
                                </NavLink>


                                <NavLink 
                                    href="/client/products" 
                                    active={route().current('client.catalog') || route().current('client.product.*')}
                                    className="relative z-50"
                                    onClick={(e) => {
                                        const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
                                        if (savedPaymentMethod) {
                                            const paymentMethod = JSON.parse(savedPaymentMethod);
                                            e.preventDefault();
                                            router.visit(`/client/products?payment_method_id=${paymentMethod.id}`);
                                        }
                                    }}
                                >
                                    <div className="flex items-center relative z-50">
                                        <ShoppingCartIcon className="h-4 w-4 mr-2 relative z-50" />
                                        {t('products')}
                                    </div>
                                </NavLink>

                               {/* l'historique des commandes   */}
                                <NavLink href="/orders/history" active={route().current('client.orders.*')} className="relative z-50">
                                    <div className="flex items-center relative z-50">
                                        <ClockIcon className="h-4 w-4 mr-2 relative z-50" />
                                        {t('orders')}
                                    </div>
                                </NavLink>

                                {/* Panier */}
                                <NavLink href="/cart" active={route().current('client.cart')} className="relative z-50">
                                    <div className="flex items-center relative z-50">
                                        <ShoppingCartIcon className="h-4 w-4 mr-2 relative z-50" />
                                        {t('cart')}
                                    </div>
                                </NavLink>
                            </div>
                        </div>

                        {/* Settings Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ml-4 lg:ml-6 sm:space-x-2 lg:space-x-4">
                            {/* Dark mode toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="relative z-50 p-1.5 sm:p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={darkMode ? 'Mode clair' : 'Mode sombre'}
                            >
                                {darkMode ? (
                                    <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                    <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                            </button>

                            {/* Language selector */}
                            <div className="relative z-50">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="relative z-50 flex items-center p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                            <LanguageIcon className="h-5 w-5" />
                                            <span className="ml-1 text-sm hidden lg:block">
                                                {i18n.language.toUpperCase()}
                                            </span>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="48">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center transition-colors duration-200 ${i18n.language === lang.code
                                                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                                    : ''
                                                    }`}
                                            >
                                                <span className="mr-2">{lang.flag}</span>
                                                {lang.name}
                                            </button>
                                        ))}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            {/* Admin Panel Navigation - Only for admins */}
                            {(user.role === 'admin' || user.role === 'gestionnaire_commande') && (
                                <Link
                                    href={route('admin.dashboard')}
                                    className="relative z-50 inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600"
                                    title={t('backToAdminPanel')}
                                >
                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    <span className="hidden lg:inline">{t('switchToAdmin')}</span>
                                </Link>
                            )}

                            {/* User Dropdown */}
                            <div className="ml-3 relative z-50">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-2">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                {user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            {t('profile')}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            {t('logout')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Responsive Navigation Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-0.5 relative z-[55]">
                        <ResponsiveNavLink href="/" active={route().current('welcome')} className="relative z-[60] transform transition-transform duration-200 active:scale-95">
                            <div className="flex items-center py-1 relative z-[60]">
                                <HomeIcon className="h-5 w-5 mr-3 relative z-[60]" />
                                {t('home')}
                            </div>
                        </ResponsiveNavLink>


                        <ResponsiveNavLink 
                            href="/client/products" 
                            active={route().current('client.catalog') || route().current('client.product.*')}
                            onClick={(e) => {
                                const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
                                if (savedPaymentMethod) {
                                    const paymentMethod = JSON.parse(savedPaymentMethod);
                                    e.preventDefault();
                                    router.visit(`/client/products?payment_method_id=${paymentMethod.id}`);
                                }
                            }}
                            className="relative z-[60] transform transition-transform duration-200 active:scale-95"
                        >
                            <div className="flex items-center py-1 relative z-[60]">
                                <ShoppingCartIcon className="h-5 w-5 mr-3 relative z-[60]" />
                                {t('products')}
                            </div>
                        </ResponsiveNavLink>

                        <ResponsiveNavLink 
                            href="/orders/history" 
                            active={route().current('client.orders.*')}
                            className="relative z-[60] transform transition-transform duration-200 active:scale-95"
                        >
                            <div className="flex items-center relative z-[60]">
                                <ClockIcon className="h-4 w-4 mr-2 relative z-[60]" />
                                {t('orders')}
                            </div>
                        </ResponsiveNavLink>

                        <ResponsiveNavLink 
                            href="/cart" 
                            active={route().current('client.cart')}
                            className="relative z-[60] transform transition-transform duration-200 active:scale-95"
                        >
                            <div className="flex items-center relative z-[60]">
                                <ShoppingCartIcon className="h-4 w-4 mr-2 relative z-[60]" />
                                {t('cart')}
                            </div>
                        </ResponsiveNavLink>
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200 mb-1">
                                {user.name}
                            </div>
                            <div className="font-medium text-xs sm:text-sm text-gray-500 truncate">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-4 space-y-1">
                            {/* Dark mode mobile */}
                            <button
                                onClick={toggleDarkMode}
                                className="w-full flex items-center px-4 py-2 text-left text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
                            >
                                {darkMode ? (
                                    <>
                                        <SunIcon className="h-5 w-5 mr-2" />
                                        Mode clair
                                    </>
                                ) : (
                                    <>
                                        <MoonIcon className="h-5 w-5 mr-2" />
                                        Mode sombre
                                    </>
                                )}
                            </button>

                            {/* Languages mobile */}
                            <div className="px-4 py-2">
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Langue</div>
                                <div className="space-y-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full text-left px-2 py-1 text-sm rounded transition-colors duration-200 ${i18n.language === lang.code
                                                ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                }`}
                                        >
                                            <span className="mr-2">{lang.flag}</span>
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Admin Panel Navigation - Mobile */}
                            {(user.role === 'admin' || user.role === 'gestionnaire_commande') && (
                                <Link
                                    href={route('admin.dashboard')}
                                    className="w-full flex items-center px-4 py-2 text-left text-base font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition duration-150 ease-in-out border-l-4 border-blue-500"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    {t('backToAdminPanel')}
                                </Link>
                            )}

                            <ResponsiveNavLink href={route('profile.edit')}>
                                {t('profile')}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                {t('logout')}
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Heading */}
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Page Content */}
            <main className="min-h-screen">{children}</main>

            {/* Toast Container */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: darkMode ? '#374151' : '#363636',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '14px',
                        maxWidth: '500px',
                    },
                    success: {
                        style: {
                            background: '#10B981',
                            color: '#fff',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444',
                            color: '#fff',
                        },
                    },
                }}
                containerStyle={{
                    top: 20,
                }}
            />
        </div>
    );
}