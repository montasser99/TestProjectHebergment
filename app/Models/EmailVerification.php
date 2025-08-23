<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class EmailVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'code',
        'type',
        'expires_at',
        'verified',
        'user_data',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'verified' => 'boolean',
        'user_data' => 'array',
    ];

    /**
     * Générer un code de vérification aléatoire de 6 chiffres
     */
    public static function generateCode(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Créer une nouvelle vérification d'email
     */
    public static function createVerification(string $email, string $type, array $userData = null): self
    {
        // Supprimer les anciennes vérifications expirées
        static::where('email', $email)
              ->where('type', $type)
              ->where('expires_at', '<', now())
              ->delete();

        // Supprimer les vérifications non utilisées de cet email pour ce type
        static::where('email', $email)
              ->where('type', $type)
              ->where('verified', false)
              ->delete();

        return static::create([
            'email' => $email,
            'code' => static::generateCode(),
            'type' => $type,
            'expires_at' => Carbon::now()->addMinutes(15), // Code valide 15 minutes
            'user_data' => $userData,
        ]);
    }

    /**
     * Vérifier un code
     */
    public static function verifyCode(string $email, string $code, string $type): ?self
    {
        return static::where('email', $email)
                    ->where('code', $code)
                    ->where('type', $type)
                    ->where('verified', false)
                    ->where('expires_at', '>', now())
                    ->first();
    }

    /**
     * Marquer comme vérifié
     */
    public function markAsVerified(): void
    {
        $this->update(['verified' => true]);
    }

    /**
     * Vérifier si le code est expiré
     */
    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }
}
