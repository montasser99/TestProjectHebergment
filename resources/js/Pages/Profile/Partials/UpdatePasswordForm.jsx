import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const { t } = useTranslation();
    const user = usePage().props.auth.user;
    
    // Vérifier si l'utilisateur peut modifier son mot de passe (seulement admin)
    const canChangePassword = user.role === 'admin'|| user.role === 'gestionnaire_commande'|| user.role === 'client';

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        if (!canChangePassword) return;

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t('updatePassword')}
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {canChangePassword ? t('updatePasswordDescription') : t('passwordReadOnlyDescription')}
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value={t('currentPassword')}
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={canChangePassword ? (e) =>
                            setData('current_password', e.target.value) : undefined
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        disabled={!canChangePassword}
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value={t('newPassword')} />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={canChangePassword ? (e) => setData('password', e.target.value) : undefined}
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        disabled={!canChangePassword}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={t('confirmNewPassword')}
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={canChangePassword ? (e) =>
                            setData('password_confirmation', e.target.value) : undefined
                        }
                        type="password"
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        disabled={!canChangePassword}
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {canChangePassword && (
                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>{t('save')}</PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('saved')}.
                            </p>
                        </Transition>
                    </div>
                )}
            </form>
        </section>
    );
}
