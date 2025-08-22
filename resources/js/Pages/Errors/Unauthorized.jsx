import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Unauthorized() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Accès non autorisé" />
            
            <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        {/* Icône d'interdiction */}
                        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
                            <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                        
                        {/* Code d'erreur */}
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
                        
                        {/* Titre principal */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Accès non autorisé
                        </h2>
                        
                        {/* Message d'explication */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Vous ne pouvez pas accéder à cette page
                                    </h3>
                                    <p className="mt-2 text-sm text-red-700">
                                        Cette section est réservée aux administrateurs uniquement. 
                                        Vous n'avez pas les permissions nécessaires pour accéder à cette ressource.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Informations supplémentaires */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800">
                                        Besoin d'aide ?
                                    </h3>
                                    <p className="mt-2 text-sm text-blue-700">
                                        Si vous pensez que c'est une erreur, contactez l'administrateur système 
                                        ou retournez à la page d'accueil.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Boutons d'action */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Retour à l'accueil
                            </Link>
                            
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                            >
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Page précédente
                            </button>
                        </div>
                        
                        {/* Footer avec informations */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                Code d'erreur: <span className="font-mono bg-gray-100 px-2 py-1 rounded">HTTP 403</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                AMAZIGHI SHOP - Système de gestion
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    );
}