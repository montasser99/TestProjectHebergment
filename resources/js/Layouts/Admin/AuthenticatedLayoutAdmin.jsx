import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import toast, { Toaster } from 'react-hot-toast';
import {
    UserGroupIcon,
    ChartBarIcon,
    CubeIcon,
    CreditCardIcon,
    TagIcon,
    ShoppingCartIcon,
    Bars3Icon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SunIcon,
    MoonIcon,
    LanguageIcon,
} from '@heroicons/react/24/outline';

export default function AuthenticatedLayoutAdmin({ header, children }) {
    const user = usePage().props.auth.user;
    const { t, i18n } = useTranslation();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

    // Navigation pour Admin
    const navigation = [
        {
            name: t('dashboard'),
            href: '/admin/dashboard',
            icon: ChartBarIcon,
            current: route().current('admin.dashboard')
        },
        {
            name: t('users'),
            href: '/admin/users',
            icon: UserGroupIcon,
            current: route().current('admin.users.*')
        },
        {
            name: t('productTypes'),
            href: '/admin/type-produits',
            icon: TagIcon,
            current: route().current('admin.type-produits.*')
        },
        {
            name: t('paymentMethods'),
            href: '/admin/price-methodes',
            icon: CreditCardIcon,
            current: route().current('admin.price-methodes.*')
        },
        {
            name: t('products'),
            href: '/admin/produits',
            icon: CubeIcon,
            current: route().current('admin.produits.*')
        },
        {
            name: t('orders'),
            href: '/admin/commandes',
            icon: ShoppingCartIcon,
            current: route().current('admin.commandes.*')
        },
    ];

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'ar', name: 'العربية', flag: '🇹🇳' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar Desktop */}
            <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-500 ease-in-out transform ${
                sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
            }`}>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-4 pb-4 shadow-lg">
                    {/* Toggle Button */}
                    <div className="flex h-16 shrink-0 items-center justify-between">
                        {!sidebarCollapsed && (
                            <div className="flex items-center animate-fade-in">
                                <ApplicationLogo className="h-8 w-auto" />
                                <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white animate-slide-in">
                                    AMAZIGHI SHOP
                                </span>
                            </div>
                        )}

                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className={`group relative p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                sidebarCollapsed ? 'mx-auto' : ''
                            }`}
                            title={sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
                        >
                            {sidebarCollapsed ? (
                                <ChevronRightIcon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                            ) : (
                                <ChevronLeftIcon className="w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600" />
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold transition-all duration-200 ${
                                                    item.current
                                                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                                title={sidebarCollapsed ? item.name : ''}
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 shrink-0 ${
                                                        item.current 
                                                            ? 'text-blue-600 dark:text-blue-400' 
                                                            : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                                    }`}
                                                />
                                                {!sidebarCollapsed && item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Header principal fixe */}
            <div className={`sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300 ${
                sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
            }`}>
                {/* Mobile menu button */}
                <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="h-6 w-6" />
                </button>

                <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <div className="flex flex-1 items-center">
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">AMAZIGHI SHOP - Admin</h1>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title={darkMode ? 'Light mode' : 'Dark mode'}
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
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center ${
                                                i18n.language === lang.code ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : ''
                                            }`}
                                        >
                                            <span className="mr-2">{lang.flag}</span>
                                            {lang.name}
                                        </button>
                                    ))}
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Profile dropdown */}
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition-colors">
                                        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="hidden lg:flex lg:items-center">
                                            <span className="ml-2 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                                                {user.name}
                                            </span>
                                            <svg className="ml-2 h-5 w-5 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
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
                </div>
            </div>

            {/* Header secondaire optionnel */}
            {header && (
                <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${
                    sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
                }`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        {header}
                    </div>
                </div>
            )}

            {/* Mobile sidebar */}
            <div className={`relative z-50 lg:hidden ${showingNavigationDropdown ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-900/80" onClick={() => setShowingNavigationDropdown(false)} />

                <div className="fixed inset-0 flex">
                    <div className="relative mr-16 flex w-full max-w-xs flex-1">
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5"
                                onClick={() => setShowingNavigationDropdown(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <XMarkIcon className="h-6 w-6 text-white" />
                            </button>
                        </div>

                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4">
                            <div className="flex h-16 shrink-0 items-center">
                                <ApplicationLogo className="h-8 w-auto" />
                                <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
                                    AMAZIGHI SHOP
                                </span>
                            </div>

                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ul role="list" className="-mx-2 space-y-1">
                                            {navigation.map((item) => (
                                                <li key={item.name}>
                                                    <ResponsiveNavLink
                                                        href={item.href}
                                                        active={item.current}
                                                        className="flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                    >
                                                        <item.icon className="h-5 w-5 shrink-0" />
                                                        {item.name}
                                                    </ResponsiveNavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>

                                    {/* User info mobile */}
                                    <li className="mt-auto">
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <div className="flex items-center gap-x-4 px-2 py-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                                </div>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                                    Admin
                                                </span>
                                            </div>

                                            <div className="mt-3 space-y-1 px-2">
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
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className={`transition-all duration-300 ${
                sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
            }`}>
                {children}
            </main>

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
                    top: 80,
                }}
            />
        </div>
    );
}