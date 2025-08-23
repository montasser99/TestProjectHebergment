import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { useTranslation } from 'react-i18next';
import { 
    MagnifyingGlassIcon, 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    LockClosedIcon,
    LockOpenIcon
} from '@heroicons/react/24/outline';
import instantToast from '@/Utils/InstantToast';

export default function Index({ auth, users, filters }) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search, role });
    };

    const handleDelete = (user) => {
        instantToast.confirm({
            title: t('confirmDelete'),
            message: t('confirmDeleteMessage', { name: user.name }),
            confirmText: t('delete'),
            cancelText: t('cancel'),
            variant: 'danger',
            onConfirm: () => {
                router.delete(`/admin/users/${user.id}`, {
                    onSuccess: () => {
                        instantToast.success(t('userDeletedSuccess', { name: user.name }));
                    },
                    onError: (errors) => {
                        if (errors.error) {
                            instantToast.error(errors.error);
                        } else {
                            instantToast.error(t('errorDeleting'));
                        }
                    }
                });
            }
        });
    };

    const handleBlock = (user) => {
        const isBlocked = user.is_blocked;
        
        instantToast.confirm({
            title: isBlocked ? t('confirmUnblock') : t('confirmBlock'),
            message: isBlocked ? t('confirmUnblockMessage', { name: user.name }) : t('confirmBlockMessage', { name: user.name }),
            confirmText: isBlocked ? t('unblock') : t('block'),
            cancelText: t('cancel'),
            variant: isBlocked ? 'info' : 'warning',
            onConfirm: () => {
                const url = isBlocked ? `/admin/users/${user.id}/unblock` : `/admin/users/${user.id}/block`;
                
                router.patch(url, {}, {
                    onSuccess: () => {
                        instantToast.success(isBlocked ? t('userUnblockedSuccess', { name: user.name }) : t('userBlockedSuccess', { name: user.name }));
                    },
                    onError: (errors) => {
                        if (errors.error) {
                            instantToast.error(errors.error);
                        } else {
                            instantToast.error(isBlocked ? t('errorUnblocking') : t('errorBlocking'));
                        }
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('userManagement')}
                    </h2>
                    <Link
                        href="/admin/users/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 w-full sm:w-auto"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>{t('addUser')}</span>
                    </Link>
                </div>
            }
        >
            <Head title={t('users')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtres */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleSearch} className="space-y-4 sm:space-y-0 sm:flex sm:gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={t('searchUserPlaceholder')}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div className="sm:w-48">
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-base sm:text-sm"
                                    >
                                        <option value="">{t('allRoles')}</option>
                                        <option value="admin">{t('admin')}</option>
                                        <option value="client">{t('client')}</option>
                                        <option value="gestionnaire_commande">{t('orderManager')}</option>
                                    </select>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 sm:py-2 rounded-lg transition-colors duration-200 font-medium text-base sm:text-sm flex items-center justify-center space-x-2"
                                >
                                    <MagnifyingGlassIcon className="h-5 w-5 sm:hidden" />
                                    <span>{t('search')}</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Tableau des utilisateurs - Desktop */}
                    <div className="hidden md:block bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('name')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('email')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('phone')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('role')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('status')}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {t('actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                {t('noUsersFound')}
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {user.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                    {user.phone}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.role === 'admin' 
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                                            : user.role === 'gestionnaire_commande'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    }`}>
                                                        {user.role === 'admin' 
                                                            ? t('admin') 
                                                            : user.role === 'gestionnaire_commande'
                                                            ? t('orderManager')
                                                            : t('client')
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        !user.is_blocked 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}>
                                                        {!user.is_blocked ? t('active') : t('blocked')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={`/admin/users/${user.id}/edit`}
                                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded transition-colors duration-200"
                                                            title={t('edit')}
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
                                                        </Link>
                                                        
                                                        {user.id !== auth.user.id && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleBlock(user)}
                                                                    className={`p-1 rounded transition-colors duration-200 ${
                                                                        !user.is_blocked
                                                                            ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                                                            : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                                                                    }`}
                                                                    title={!user.is_blocked ? t('block') : t('unblock')}
                                                                >
                                                                    {!user.is_blocked ? (
                                                                        <LockClosedIcon className="h-4 w-4" />
                                                                    ) : (
                                                                        <LockOpenIcon className="h-4 w-4" />
                                                                    )}
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={() => handleDelete(user)}
                                                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors duration-200"
                                                                    title={t('delete')}
                                                                >
                                                                    <TrashIcon className="h-4 w-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Version Mobile - Cards */}
                    <div className="md:hidden space-y-4">
                        {users.data.length === 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                                <div className="text-gray-500 dark:text-gray-400">
                                    {t('noUsersFound')}
                                </div>
                            </div>
                        ) : (
                            users.data.map((user) => (
                                <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                                    {/* Header avec avatar et nom */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-lg">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="flex items-center space-x-2 flex-wrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.role === 'admin' 
                                                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                                                            : user.role === 'gestionnaire_commande'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    }`}>
                                                        {user.role === 'admin' 
                                                            ? t('admin') 
                                                            : user.role === 'gestionnaire_commande'
                                                            ? t('orderManager')
                                                            : t('client')
                                                        }
                                                    </span>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        !user.is_blocked 
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                    }`}>
                                                        {!user.is_blocked ? t('active') : t('blocked')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations utilisateur */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400 w-16 font-medium">{t('email')}:</span>
                                            <span className="text-gray-900 dark:text-gray-100 break-all">{user.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <span className="text-gray-500 dark:text-gray-400 w-16 font-medium">{t('phone')}:</span>
                                            <span className="text-gray-900 dark:text-gray-100">{user.phone}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-600">
                                        <Link
                                            href={`/admin/users/${user.id}/edit`}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            <PencilIcon className="h-4 w-4 mr-1" />
                                            {t('edit')}
                                        </Link>
                                        
                                        {user.id !== auth.user.id && (
                                            <>
                                                <button
                                                    onClick={() => handleBlock(user)}
                                                    className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors duration-200 ${
                                                        !user.is_blocked
                                                            ? 'border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                            : 'border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                    }`}
                                                >
                                                    {!user.is_blocked ? (
                                                        <>
                                                            <LockClosedIcon className="h-4 w-4 mr-1" />
                                                            {t('block')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <LockOpenIcon className="h-4 w-4 mr-1" />
                                                            {t('unblock')}
                                                        </>
                                                    )}
                                                </button>
                                                
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="inline-flex items-center px-3 py-2 border border-red-300 dark:border-red-600 rounded-md text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                                >
                                                    <TrashIcon className="h-4 w-4 mr-1" />
                                                    {t('delete')}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* Pagination - Commune aux deux versions */}
                    {users.links && (
                        <div className="bg-white dark:bg-gray-800 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between md:hidden">
                                    {users.prev_page_url && (
                                        <Link
                                            href={users.prev_page_url}
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            {t('previous')}
                                        </Link>
                                    )}
                                    {users.next_page_url && (
                                        <Link
                                            href={users.next_page_url}
                                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            {t('next')}
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {t('showingResults', { from: users.from, to: users.to, total: users.total })}
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            {users.links.map((link, index) => (
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
                                                        index === users.links.length - 1 ? 'rounded-r-md' : ''
                                                    }`}
                                                >
                                                    {link.label.includes('Previous') ? t('previous') : 
                                                     link.label.includes('Next') ? t('next') : 
                                                     <span dangerouslySetInnerHTML={{ __html: link.label }} />}
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
        </AuthenticatedLayout>
    );
}