import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    SunIcon,
    MoonIcon,
    LanguageIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function GuestHeader({ auth }) {
    const { t, i18n } = useTranslation();
    const [darkMode, setDarkMode] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

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
        <header className="fixed w-full top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo className="h-8 w-8 fill-current text-blue-600 dark:text-blue-400" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                AMAZIGHI SHOP
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title={darkMode ? t('lightMode') : t('darkMode')}
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
                                    <button className="flex items-center p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <LanguageIcon className="h-5 w-5" />
                                        <span className="ml-1 text-sm">
                                            {i18n.language.toUpperCase()}
                                        </span>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="right" width="48">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center transition-colors ${
                                                i18n.language === lang.code
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

                        {/* Auth buttons */}
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                {t('dashboard')}
                            </Link>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href={route('login')}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                                >
                                    {t('login')}
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    {t('register')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {showMobileMenu ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {showMobileMenu && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-3">
                            {/* Dark mode mobile */}
                            <button
                                onClick={toggleDarkMode}
                                className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                {darkMode ? (
                                    <>
                                        <SunIcon className="h-5 w-5 mr-3" />
                                        {t('lightMode')}
                                    </>
                                ) : (
                                    <>
                                        <MoonIcon className="h-5 w-5 mr-3" />
                                        {t('darkMode')}
                                    </>
                                )}
                            </button>

                            {/* Languages mobile */}
                            <div className="px-3 py-2">
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                    {t('language')}
                                </div>
                                <div className="space-y-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                                                i18n.language === lang.code
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

                            {/* Auth buttons mobile */}
                            <div className="px-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        {t('dashboard')}
                                    </Link>
                                ) : (
                                    <div className="space-y-2">
                                        <Link
                                            href={route('login')}
                                            className="block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                        >
                                            {t('register')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}