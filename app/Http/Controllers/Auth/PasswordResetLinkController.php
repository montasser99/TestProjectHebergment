<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EmailVerification;
use App\Mail\EmailVerificationCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset request - Send verification code
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Vérifier que l'utilisateur existe
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Aucun compte trouvé avec cette adresse email.'],
            ]);
        }

        // Créer la vérification par email pour reset password
        $verification = EmailVerification::createVerification(
            $request->email,
            'reset_password'
        );

        // Envoyer l'email avec le code
        try {
            Mail::to($request->email)->send(
                new EmailVerificationCode($verification->code, 'reset_password', $user->name)
            );

            return redirect()->route('password.verify.form', ['email' => $request->email])
                           ->with('status', 'Un code de vérification a été envoyé à votre adresse email.');
                           
        } catch (\Exception $e) {
            // En cas d'erreur d'envoi d'email
            $verification->delete();
       
            throw ValidationException::withMessages([
                'email' => ['Impossible d\'envoyer l\'email de vérification. Veuillez réessayer.'],
            ]);
        }
    }

    /**
     * Show password reset verification form
     */
    public function showPasswordVerifyForm(Request $request): Response
    {
        $email = $request->query('email');
        
        if (!$email) {
            return redirect()->route('password.request');
        }

        return Inertia::render('Auth/VerifyEmail', [
            'email' => $email,
            'type' => 'reset_password'
        ]);
    }

    /**
     * Verify the reset password code
     */
    public function verifyPasswordResetCode(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $verification = EmailVerification::verifyCode($request->email, $request->code, 'reset_password');

        if (!$verification) {
            return back()->withErrors([
                'code' => 'Code de vérification invalide ou expiré.'
            ]);
        }

        // Marquer comme vérifié
        $verification->markAsVerified();

        // Rediriger vers la page de nouveau mot de passe avec un token temporaire
        return redirect()->route('password.reset', [
            'token' => base64_encode($request->email . '|' . $verification->id . '|' . now()->timestamp),
            'email' => $request->email
        ]);
    }

    /**
     * Resend verification code for password reset
     */
    public function resendPasswordCode(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Vérifier que l'utilisateur existe
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return back()->withErrors([
                'email' => 'Aucun compte trouvé avec cette adresse email.'
            ]);
        }

        // Créer un nouveau code
        $verification = EmailVerification::createVerification(
            $request->email,
            'reset_password'
        );

        // Renvoyer l'email
        try {
            Mail::to($request->email)->send(
                new EmailVerificationCode($verification->code, 'reset_password', $user->name)
            );

            return back()->with('status', 'Un nouveau code de vérification a été envoyé.');
            
        } catch (\Exception $e) {
            return back()->withErrors([
                'email' => 'Impossible de renvoyer l\'email. Veuillez réessayer.'
            ]);
        }
    }

}