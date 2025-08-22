import toast from 'react-hot-toast';

const ConfirmDialog = ({ 
    title, 
    message, 
    confirmText = 'Confirmer', 
    cancelText = 'Annuler',
    onConfirm,
    onCancel,
    variant = 'danger' // 'danger', 'warning', 'info'
}) => {
    const getColors = () => {
        switch (variant) {
            case 'danger':
                return {
                    confirmBg: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
                    confirmText: 'text-white',
                    icon: '🗑️'
                };
            case 'warning':
                return {
                    confirmBg: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800',
                    confirmText: 'text-white',
                    icon: '⚠️'
                };
            case 'info':
                return {
                    confirmBg: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
                    confirmText: 'text-white',
                    icon: 'ℹ️'
                };
            default:
                return {
                    confirmBg: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
                    confirmText: 'text-white',
                    icon: '🗑️'
                };
        }
    };

    const colors = getColors();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
                <div className="text-2xl">{colors.icon}</div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {message}
            </p>
            
            <div className="flex space-x-3 justify-end">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 border border-gray-300 dark:border-gray-600"
                >
                    {cancelText}
                </button>
                <button
                    onClick={onConfirm}
                    className={`px-4 py-2 text-sm font-medium ${colors.confirmText} ${colors.confirmBg} rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800`}
                >
                    {confirmText}
                </button>
            </div>
        </div>
    );
};

// Fonction helper pour afficher une confirmation
export const showConfirmDialog = ({
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    variant = 'danger'
}) => {
    const toastId = toast.custom((t) => (
        <ConfirmDialog
            title={title}
            message={message}
            confirmText={confirmText}
            cancelText={cancelText}
            onConfirm={() => {
                // Fermeture instantanée (0ms) puis action
                toast.remove(t.id);
                setTimeout(() => onConfirm && onConfirm(), 0);
            }}
            onCancel={() => {
                // Fermeture instantanée (0ms) puis action
                toast.remove(t.id);
                setTimeout(() => onCancel && onCancel(), 0);
            }}
            variant={variant}
        />
    ), {
        duration: Infinity,
        position: 'top-center',
        style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
        },
    });
};

export default ConfirmDialog;