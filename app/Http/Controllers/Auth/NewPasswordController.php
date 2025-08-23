<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\EmailVerification;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response
    {
        $token = $request->route('token');
        $email = $request->email;
        
        // Valider le token temporaire
        if (!$this->validateResetToken($token, $email)) {
            return redirect()->route('password.request')
                           ->withErrors(['email' => 'Token de réinitialisation invalide ou expiré.']);
        }
        
        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
            'token' => $token,
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Valider le token
        if (!$this->validateResetToken($request->token, $request->email)) {
            throw ValidationException::withMessages([
                'email' => ['Token de réinitialisation invalide ou expiré.'],
            ]);
        }

        // Récupérer l'utilisateur
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => ['Utilisateur non trouvé.'],
            ]);
        }

        // Mettre à jour le mot de passe
        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();

        // Déclencher l'événement
        event(new PasswordReset($user));
        
        // Nettoyer les vérifications utilisées
        $this->cleanupResetToken($request->token);

        return redirect()->route('login')
                       ->with('status', 'Votre mot de passe a été réinitialisé avec succès.');
    }

    /**
     * Valider le token de réinitialisation
     */
    private function validateResetToken(string $token, string $email): bool
    {
        try {
            $decoded = base64_decode($token);
            $parts = explode('|', $decoded);
            
            if (count($parts) !== 3) {
                return false;
            }
            
            [$tokenEmail, $verificationId, $timestamp] = $parts;
            
            // Vérifier que l'email correspond
            if ($tokenEmail !== $email) {
                return false;
            }
            
            // Vérifier que le token n'est pas trop ancien (30 minutes max)
            if (now()->timestamp - $timestamp > 1800) {
                return false;
            }
            
            // Vérifier que la vérification existe et est marquée comme vérifiée
            $verification = EmailVerification::find($verificationId);
            
            return $verification && 
                   $verification->verified && 
                   $verification->email === $email && 
                   $verification->type === 'reset_password';
                   
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Nettoyer les tokens utilisés
     */
    private function cleanupResetToken(string $token): void
    {
        try {
            $decoded = base64_decode($token);
            $parts = explode('|', $decoded);
            
            if (count($parts) === 3) {
                $verificationId = $parts[1];
                EmailVerification::find($verificationId)?->delete();
            }
        } catch (\Exception $e) {
            // Ignorer les erreurs de nettoyage
        }
    }
}
