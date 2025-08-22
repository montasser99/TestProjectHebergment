import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-indigo-400 dark:border-indigo-500 text-gray-900 dark:text-white focus:border-indigo-700 dark:focus:border-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-white focus:border-gray-300 dark:focus:border-gray-600 focus:text-gray-700 dark:focus:text-white') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
