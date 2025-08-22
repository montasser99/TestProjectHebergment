import AuthenticatedLayout from '@/Layouts/Admin/AuthenticatedLayoutAdmin';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Dashboard({ stats }) {
    const { t } = useTranslation();

    const StatCard = ({ title, value, icon, color = "blue", description }) => (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className={`text-3xl font-bold text-${color}-600 dark:text-${color}-400`}>{value}</p>
                    {description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                    )}
                </div>
                <div className={`text-${color}-500 dark:text-${color}-400`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    const UserIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
    );

    const ActiveUserIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const BlockedUserIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
    );

    const AdminIcon = () => (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('dashboard')} - Admin Panel
                    </h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Hello! Here are the admin statistics
                    </div>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Message */}
                    <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                        <h1 className="text-2xl font-bold mb-2">
                            🎉 Welcome to Admin Dashboard!
                        </h1>
                        <p className="text-blue-100">
                            Hello! Here are the statistics of admin panel. Monitor your application performance and user activity.
                        </p>
                    </div>

                    {/* Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Users"
                            value={stats.total_users}
                            icon={<UserIcon />}
                            color="blue"
                            description="All registered users"
                        />
                        <StatCard
                            title="Active Users"
                            value={stats.active_users}
                            icon={<ActiveUserIcon />}
                            color="green"
                            description="Non-blocked users"
                        />
                        <StatCard
                            title="Blocked Users"
                            value={stats.blocked_users}
                            icon={<BlockedUserIcon />}
                            color="red"
                            description="Blocked/suspended users"
                        />
                        <StatCard
                            title="Admin Users"
                            value={stats.admin_users}
                            icon={<AdminIcon />}
                            color="purple"
                            description="Admin role users"
                        />
                    </div>

                    {/* Time-based Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <StatCard
                            title="New Users Today"
                            value={stats.users_today}
                            icon={<UserIcon />}
                            color="cyan"
                            description="Registered today"
                        />
                        <StatCard
                            title="New Users This Week"
                            value={stats.users_this_week}
                            icon={<UserIcon />}
                            color="indigo"
                            description="Registered this week"
                        />
                        <StatCard
                            title="New Users This Month"
                            value={stats.users_this_month}
                            icon={<UserIcon />}
                            color="pink"
                            description="Registered this month"
                        />
                    </div>

                    {/* Recent Users */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                📊 Recent Users
                            </h3>
                        </div>
                        <div className="p-6">
                            {stats.recent_users && stats.recent_users.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recent_users.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">No recent users found</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                ⚡ Quick Actions
                            </h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <a
                                    href="/admin/users"
                                    className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200"
                                >
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                        <UserIcon />
                                    </div>
                                    <div>
                                        <p className="font-medium text-blue-800 dark:text-blue-300">Manage Users</p>
                                        <p className="text-sm text-blue-600 dark:text-blue-400">View and edit users</p>
                                    </div>
                                </a>
                                <a
                                    href="/admin/users/create"
                                    className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors duration-200"
                                >
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-green-800 dark:text-green-300">Add New User</p>
                                        <p className="text-sm text-green-600 dark:text-green-400">Create user account</p>
                                    </div>
                                </a>
                                <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-purple-800 dark:text-purple-300">System Reports</p>
                                        <p className="text-sm text-purple-600 dark:text-purple-400">Coming soon...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}