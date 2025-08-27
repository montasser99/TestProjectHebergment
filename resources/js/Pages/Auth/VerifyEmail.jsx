import { useEffect, useState } from 'react';
import AuthHeader from '@/Components/AuthHeader';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

export default function VerifyEmail({ email, type }) {
    const { t, i18n } = useTranslation();
    const [resendCooldown, setResendCooldown] = useState(0);
    const { flash } = usePage().props;
    
    // Configuration EmailJS sécurisée avec variables d'environnement
    const EMAILJS_CONFIG = {
        serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
        templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    };

    // Log de vérification des variables et données flash
    useEffect(() => {
        console.log('🔍 Variables EmailJS chargées:', {
            serviceId: EMAILJS_CONFIG.serviceId ? `${EMAILJS_CONFIG.serviceId.substring(0, 8)}...${EMAILJS_CONFIG.serviceId.slice(-3)}` : 'NOT SET',
            templateId: EMAILJS_CONFIG.templateId ? `${EMAILJS_CONFIG.templateId.substring(0, 9)}...${EMAILJS_CONFIG.templateId.slice(-3)}` : 'NOT SET',
            publicKey: EMAILJS_CONFIG.publicKey ? `${EMAILJS_CONFIG.publicKey.substring(0, 6)}...${EMAILJS_CONFIG.publicKey.slice(-3)}` : 'NOT SET'
        });
        console.log('📦 Flash data reçu:', flash);
        console.log('📧 EmailJS data disponible:', flash && flash.emailjs_data ? 'OUI' : 'NON');
    }, []);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: email,
        code: '',
    });

    const isSignup = type === 'signup';
    const title = isSignup ? 'Vérification Email - Inscription' : 'Vérification Email - Mot de Passe';
    const submitRoute = isSignup ? 'verify.email.code' : 'password.verify.code';
    const resendRoute = isSignup ? 'resend.verification.code' : 'resend.password.code';

    // Initialiser EmailJS et envoyer email si données disponibles
    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && savedLanguage !== i18n.language) {
            i18n.changeLanguage(savedLanguage);
        }

        // Envoyer email via EmailJS si les données sont disponibles
        if (flash && flash.emailjs_data) {
            sendEmailViaEmailJS(flash.emailjs_data);
        }
    }, []);

    const sendEmailViaEmailJS = async (emailData) => {
        try {
            await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                {
                    to_email: emailData.user_email,
                    user_name: emailData.user_name,
                    verification_code: emailData.verification_code,
                    verification_link: emailData.verification_link
                },
                EMAILJS_CONFIG.publicKey
            );
            console.log('Email envoyé avec succès via EmailJS');
        } catch (error) {
            console.error('Erreur EmailJS:', error);
        }
    };

    useEffect(() => {
        let interval;
        if (resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendCooldown]);

    const submit = (e) => {
        e.preventDefault();
        post(route(submitRoute));
    };

    const resendCode = () => {
        if (resendCooldown > 0) return;
        
        post(route(resendRoute), {
            data: { email },
            preserveScroll: true,
            onSuccess: (page) => {
                setResendCooldown(60); // 60 secondes de cooldown
                setData('code', '');
                
                // Envoyer nouveau email via EmailJS si les données sont disponibles
                if (page.props.flash && page.props.flash.emailjs_data) {
                    sendEmailViaEmailJS(page.props.flash.emailjs_data);
                }
            },
        });
    };

    // Formatter le code automatiquement
    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setData('code', value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Head title={title} />
            
            <AuthHeader />
            
            {/* Main Content */}
            <div className="flex min-h-screen items-center justify-center pt-20 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Vérification Email
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {isSignup ? 'Dernière étape avant la création de votre compte' : 'Vérifiez votre email pour continuer'}
                            </p>
                        </div>

                        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                            {isSignup ? (
                                <>
                                    <p className="mb-3">
                                        <strong>Dernière étape !</strong> Un code de vérification a été envoyé à :
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                                        <p className="font-semibold text-blue-700 dark:text-blue-300 text-center">{email}</p>
                                    </div>
                                    <p>Saisissez le code de 6 chiffres pour créer votre compte.</p>
                                </>
                            ) : (
                                <>
                                    <p className="mb-3">
                                        Un code de vérification a été envoyé à votre adresse email :
                                    </p>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                                        <p className="font-semibold text-blue-700 dark:text-blue-300 text-center">{email}</p>
                                    </div>
                                    <p>Saisissez le code de 6 chiffres pour continuer la réinitialisation de votre mot de passe.</p>
                                </>
                            )}
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="mb-6">
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Code de vérification
                                </label>
                                
                                <div className="relative">
                                    <TextInput
                                        id="code"
                                        type="text"
                                        name="code"
                                        value={data.code}
                                        className="mt-1 block w-full text-center text-2xl font-mono tracking-widest rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        style={{ letterSpacing: '0.5em' }}
                                        onChange={handleCodeChange}
                                        placeholder="000000"
                                        maxLength="6"
                                        autoComplete="one-time-code"
                                        autoFocus
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-xs text-gray-400">
                                            {data.code.length}/6
                                        </span>
                                    </div>
                                </div>

                                <InputError message={errors.code} className="mt-2" />
                                <InputError message={errors.email} className="mt-2" />
                                
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    ⏱️ Le code expire dans 15 minutes
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={resendCode}
                                    disabled={resendCooldown > 0 || processing}
                                    className={`text-sm underline transition-colors ${
                                        resendCooldown > 0 || processing
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300'
                                    }`}
                                >
                                    {resendCooldown > 0 
                                        ? `Renvoyer dans ${resendCooldown}s`
                                        : 'Renvoyer le code'
                                    }
                                </button>

                                <PrimaryButton 
                                    disabled={processing || data.code.length !== 6}
                                    className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50"
                                >
                                    {processing ? 'Vérification...' : 'Vérifier'}
                                </PrimaryButton>
                            </div>
                        </form>

                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        Vous ne recevez pas l'email ?
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Vérifiez votre dossier spam/courrier indésirable</li>
                                            <li>Attendez quelques minutes, la livraison peut prendre du temps</li>
                                            <li>Cliquez sur "Renvoyer le code" si nécessaire</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <a
                                href={route(isSignup ? 'register' : 'password.request')}
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium transition-colors"
                            >
                                ← Retour {isSignup ? "à l'inscription" : "à la demande"}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}