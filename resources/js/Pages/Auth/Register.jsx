import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '+216',
        password: '',
        password_confirmation: '',
    });

    const handleNameChange = (e) => {
        const value = e.target.value;
        // Limiter à 30 caractères
        if (value.length <= 30) {
            setData('name', value);
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Accepter seulement les chiffres et limiter à 8 caractères
        const digits = value.replace(/\D/g, '').slice(0, 8);
        setData('phone', '+216' + digits);
    };

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
        };
    };

    const passwordValidation = validatePassword(data.password);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={handleNameChange}
                        maxLength="30"
                        required
                    />

                    <div className="mt-1 flex justify-between items-center">
                        <div>
                            <InputError message={errors.name} />
                        </div>
                        <p className={`text-xs ${data.name.length > 25 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            {data.name.length}/30
                        </p>
                    </div>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Phone" />

                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 dark:text-gray-400 font-medium">+216</span>
                        </div>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={data.phone.replace('+216', '')}
                            onChange={handlePhoneChange}
                            className="block w-full pl-16 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
                            placeholder="XX XXX XXX"
                            maxLength="8"
                            pattern="[0-9]{8}"
                            required
                        />
                    </div>

                    <InputError message={errors.phone} className="mt-2" />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        8 chiffres obligatoires après +216
                    </p>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        minLength="8"
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                    
                    {/* Indicateurs de force du mot de passe */}
                    {data.password && (
                        <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Force du mot de passe :</p>
                            <div className="space-y-1">
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                                    <span>{passwordValidation.minLength ? '✓' : '✗'}</span>
                                    <span>Au moins 8 caractères</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                                    <span>{passwordValidation.hasUpperCase ? '✓' : '✗'}</span>
                                    <span>Une lettre majuscule</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                                    <span>{passwordValidation.hasLowerCase ? '✓' : '✗'}</span>
                                    <span>Une lettre minuscule</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-red-600'}`}>
                                    <span>{passwordValidation.hasNumbers ? '✓' : '✗'}</span>
                                    <span>Un chiffre</span>
                                </div>
                                <div className={`flex items-center space-x-2 text-xs ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                                    <span>{passwordValidation.hasSpecialChar ? '✓' : '✗'}</span>
                                    <span>Un caractère spécial (!@#$%^&*)</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
