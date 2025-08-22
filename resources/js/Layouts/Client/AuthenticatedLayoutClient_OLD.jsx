import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';

export default function AuthenticatedLayout({ header, children }) {
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

    // Changement de langue avec animation
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    const languages = [
        { code: 'fr', name: 'FR', flag: '🇫🇷' },
        { code: 'ar', name: 'AR', flag: '🇹🇳' },
        { code: 'en', name: 'EN', flag: '🇺🇸' },
    ];

    // Icons en SVG simple
    const SunIcon = () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    );

    const MoonIcon = () => (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
    );

    return (
        <div className="min-h-screen">
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
                <nav className="border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                                <span className="text-white font-bold text-sm">AS</span>
                                            </div>
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                AMAZIGHI SHOP
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    {user.role === 'admin' ? (
                                        <>
                                            <NavLink
                                                href="/admin/dashboard"
                                                active={route().current('admin.dashboard')}
                                                className="transition-colors duration-200"
                                            >
                                                {t('dashboard')}
                                            </NavLink>
                                            <NavLink
                                                href="/admin/users"
                                                active={route().current('admin.users*')}
                                                className="transition-colors duration-200"
                                            >
                                                {t('users')}
                                            </NavLink>
                                            <NavLink
                                                href="/admin/type-produits"
                                                active={route().current('admin.type-produits*')}
                                                className="transition-colors duration-200"
                                            >
                                                {t('productTypes')}
                                            </NavLink>
                                            <NavLink
                                                href="/admin/price-methodes"
                                                active={route().current('admin.price-methodes*')}
                                                className="transition-colors duration-200"
                                            >
                                                {t('paymentMethods')}
                                            </NavLink>
                                            <NavLink
                                                href="/admin/produits"
                                                active={route().current('admin.produits*')}
                                                className="transition-colors duration-200"
                                            >
                                                {t('products')}
                                            </NavLink>
                                        </>
                                    ) : (
                                        <NavLink
                                            href="/home"
                                            active={route().current('home')}
                                            className="transition-colors duration-200"
                                        >
                                            {t('home')}
                                        </NavLink>
                                    )}
                                </div>
                            </div>

                            <div className="hidden sm:ms-6 sm:flex sm:items-center space-x-4">
                                {/* Sélecteur de langue avec animation */}
                                <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${i18n.language === lang.code
                                                ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {lang.flag} {lang.name}
                                        </button>
                                    ))}
                                </div>

                                {/* Toggle mode sombre avec animation */}
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                                >
                                    {darkMode ? <SunIcon /> : <MoonIcon />}
                                </button>

                                <div className="relative ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md border border-transparent bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-300 transition duration-150 ease-in-out hover:text-gray-700 dark:hover:text-white focus:outline-none"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
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
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                            >
                                                {t('logout')}
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center sm:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            (previousState) => !previousState,
                                        )
                                    }
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-200 focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-500 dark:focus:text-gray-200 focus:outline-none"
                                >
                                    <svg
                                        className="h-6 w-6"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            className={
                                                !showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                        <path
                                            className={
                                                showingNavigationDropdown
                                                    ? 'inline-flex'
                                                    : 'hidden'
                                            }
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

                    {/* Navigation mobile */}
                    <div
                        className={
                            (showingNavigationDropdown ? 'block' : 'hidden') +
                            ' sm:hidden'
                        }
                    >
                        <div className="space-y-1 pb-3 pt-2">
                            {user.role === 'admin' ? (
                                <>
                                    <ResponsiveNavLink
                                        href="/admin/dashboard"
                                        active={route().current('admin.dashboard')}
                                    >
                                        {t('dashboard')}
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href="/admin/users"
                                        active={route().current('admin.users*')}
                                    >
                                        {t('users')}
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href="/admin/type-produits"
                                        active={route().current('admin.type-produits*')}
                                    >
                                        {t('productTypes')}
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href="/admin/price-methodes"
                                        active={route().current('admin.price-methodes*')}
                                    >
                                        {t('paymentMethods')}
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        href="/admin/produits"
                                        active={route().current('admin.produits*')}
                                    >
                                        {t('products')}
                                    </ResponsiveNavLink>
                                </>
                            ) : (
                                <ResponsiveNavLink
                                    href="/home"
                                    active={route().current('home')}
                                >
                                    {t('home')}
                                </ResponsiveNavLink>
                            )}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-600 pb-1 pt-4">
                            <div className="px-4">
                                <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>
                                    {t('profile')}
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                >
                                    {t('logout')}
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="bg-white dark:bg-gray-800 shadow transition-colors duration-300">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <div className="text-gray-900 dark:text-white">
                                {header}
                            </div>
                        </div>
                    </header>
                )}

                <main className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <div className="text-gray-900 dark:text-white">
                        {children}
                    </div>
                </main>

                {/* Toast Notifications */}
                <Toaster
                    position="top-right"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                    toastOptions={{
                        // Define default options
                        className: '',
                        duration: 4000,
                        style: {
                            background: darkMode ? '#374151' : '#ffffff',
                            color: darkMode ? '#f9fafb' : '#111827',
                            border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            boxShadow: darkMode
                                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
                                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            pointerEvents: 'auto',
                        },
                        // Customize success notifications
                        success: {
                            duration: 4000,
                            style: {
                                background: darkMode ? '#065f46' : '#dcfce7',
                                color: darkMode ? '#a7f3d0' : '#166534',
                                border: darkMode ? '1px solid #059669' : '1px solid #16a34a',
                            },
                            iconTheme: {
                                primary: darkMode ? '#10b981' : '#16a34a',
                                secondary: darkMode ? '#065f46' : '#dcfce7',
                            },
                        },
                        // Customize error notifications
                        error: {
                            duration: 4000,
                            style: {
                                background: darkMode ? '#7f1d1d' : '#fef2f2',
                                color: darkMode ? '#fca5a5' : '#dc2626',
                                border: darkMode ? '1px solid #dc2626' : '1px solid #ef4444',
                            },
                            iconTheme: {
                                primary: darkMode ? '#ef4444' : '#dc2626',
                                secondary: darkMode ? '#7f1d1d' : '#fef2f2',
                            },
                        },
                        // Customize loading notifications
                        loading: {
                            style: {
                                background: darkMode ? '#1e40af' : '#dbeafe',
                                color: darkMode ? '#93c5fd' : '#1d4ed8',
                                border: darkMode ? '1px solid #2563eb' : '1px solid #3b82f6',
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}