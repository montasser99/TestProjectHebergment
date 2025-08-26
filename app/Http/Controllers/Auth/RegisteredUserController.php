<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EmailVerification;
use App\Mail\EmailVerificationCode;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request - Step 1: Send verification code
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'phone' => 'required|string|max:20|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Stocker temporairement les données utilisateur
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'client' // Rôle par défaut
        ];

        // Créer la vérification par email
        $verification = EmailVerification::createVerification(
            $request->email,
            'signup',
            $userData
        );

        // Envoyer l'email avec le code
        try {
            Mail::to($request->email)->send(
                new EmailVerificationCode($verification->code, 'signup', $request->name)
            );

            return redirect()->route('verify.email.form', ['email' => $request->email])
                           ->with('message', 'Un code de vérification a été envoyé à votre adresse email.');
                           
        } catch (\Exception $e) {
            // En cas d'erreur d'envoi d'email
            $verification->delete();
           
            return back()->withErrors([
                'email' => 'Impossible d\'envoyer l\'email de vérification. Veuillez réessayer.'
            ])->withInput();
        }
    }

    /**
     * Show verification code form
     */
    public function showVerificationForm(Request $request): Response
    {
        $email = $request->query('email');
        
        if (!$email) {
            return redirect()->route('register');
        }

        return Inertia::render('Auth/VerifyEmail', [
            'email' => $email,
            'type' => 'signup'
        ]);
    }

    /**
     * Verify the email code and create the user
     */
    public function verifyEmail(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $verification = EmailVerification::verifyCode($request->email, $request->code, 'signup');

        if (!$verification) {
            return back()->withErrors([
                'code' => 'Code de vérification invalide ou expiré.'
            ]);
        }

        // Créer l'utilisateur avec les données stockées
        $userData = $verification->user_data;
        
        $user = User::create($userData);

        // Marquer la vérification comme complétée
        $verification->markAsVerified();

        // Déclencher l'événement
        event(new Registered($user));

        // Connecter l'utilisateur
        Auth::login($user);

        return redirect()->route('dashboard')
                       ->with('message', 'Votre compte a été créé avec succès !');
    }

    /**
     * Resend verification code
     */
    public function resendCode(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Récupérer la vérification existante
        $existingVerification = EmailVerification::where('email', $request->email)
                                                ->where('type', 'signup')
                                                ->where('verified', false)
                                                ->first();

        if (!$existingVerification) {
            return back()->withErrors([
                'email' => 'Aucune demande de vérification trouvée pour cet email.'
            ]);
        }

        // Créer un nouveau code
        $verification = EmailVerification::createVerification(
            $request->email,
            'signup',
            $existingVerification->user_data
        );

        // Récupérer le nom depuis les données utilisateur
        $userName = $existingVerification->user_data['name'] ?? null;

        // Renvoyer l'email
        try {
            Mail::to($request->email)->send(
                new EmailVerificationCode($verification->code, 'signup', $userName)
            );

            return back()->with('message', 'Un nouveau code de vérification a été envoyé.');
            
        } catch (\Exception $e) {
            return back()->withErrors([
                'email' => 'Impossible de renvoyer l\'email. Veuillez réessayer.'
            ]);
        }
    }
}