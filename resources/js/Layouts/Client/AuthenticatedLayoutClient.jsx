import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
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
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                                <Link href="/" className="ml-2">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">AMAZIGHI SHOP</span>
                                </Link>
                            </div>

                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href="/client/payment-method" active={route().current('client.payment-method')}>
                                    <div className="flex items-center">
                                        <HomeIcon className="h-4 w-4 mr-2" />
                                        {t('home')}
                                    </div>
                                </NavLink>

                                <NavLink 
                                    href="/client/products" 
                                    active={route().current('client.catalog') || route().current('client.product.*')}
                                    onClick={(e) => {
                                        const savedPaymentMethod = localStorage.getItem('selectedPaymentMethod');
                                        if (savedPaymentMethod) {
                                            const paymentMethod = JSON.parse(savedPaymentMethod);
                                            e.preventDefault();
                                            window.location.href = `/client/products?payment_method_id=${paymentMethod.id}`;
                                        }
                                    }}
                                >
                                    <div className="flex items-center">
                                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                                        {t('products')}
                                    </div>
                                </NavLink>

                               {/* l'historique des commandes   */}
                                <NavLink href="/orders/history" active={route().current('client.orders.*')}>
                                    <div className="flex items-center">
                                        <ClockIcon className="h-4 w-4 mr-2" />
                                        {t('orders')}
                                    </div>
                                </NavLink>

                                {/* Panier */}
                                <NavLink href="/cart" active={route().current('client.cart')}>
                                    <div className="flex items-center">
                                        <ShoppingCartIcon className="h-4 w-4 mr-2" />
                                        {t('cart')}
                                    </div>
                                </NavLink>
                            </div>
                        </div>

                        {/* Settings Dropdown */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6 sm:space-x-4">
                            {/* Dark mode toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                title={darkMode ? 'Mode clair' : 'Mode sombre'}
                            >
                                {darkMode ? (
                                    <SunIcon className="h-5 w-5" />
                                ) : (
                                    <MoonIcon className="h-5 w-5" />
                                )}
                            </button>

                            {/* Language selector */}
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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

                            {/* User Dropdown */}
                            <div className="ml-3 relative">
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
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href="/client/payment-method" active={route().current('client.payment-method')}>
                            <div className="flex items-center">
                                <HomeIcon className="h-4 w-4 mr-2" />
                                {t('home')}
                            </div>
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href="/client/products" active={route().current('client.catalog') || route().current('client.product.*')}>
                            <div className="flex items-center">
                                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                                {t('products')}
                            </div>
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href="/orders/history" active={route().current('client.orders.*')}>
                            <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-2" />
                                {t('orders')}
                            </div>
                        </ResponsiveNavLink>

                        <ResponsiveNavLink href="/cart" active={route().current('client.cart')}>
                            <div className="flex items-center">
                                <ShoppingCartIcon className="h-4 w-4 mr-2" />
                                {t('cart')}
                            </div>
                        </ResponsiveNavLink>
                    </div>

                    {/* Responsive Settings Options */}
                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
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
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Page Content */}
            <main>{children}</main>

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