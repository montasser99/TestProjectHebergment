<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_facebook',
        'client_instagram',
        'total_amount',
        // SUPPRIMÉ: 'payment_method_id' car n'existe plus
        'payment_method_name',
        'notes_client',
        'notes_admin',
        'statut',
        'date_commande',
        'date_confirmation',
    ];

    protected $casts = [
        'total_amount' => 'decimal:3',
        'date_commande' => 'datetime',
        'date_confirmation' => 'datetime',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // SUPPRIMÉ: relation paymentMethod car payment_method_id n'existe plus

    public function commandeProduits()
    {
        return $this->hasMany(CommandeProduit::class);
    }

    // Helpers
    public function isPending()
    {
        return $this->statut === 'en_attente';
    }

    public function isConfirmed()
    {
        return $this->statut === 'confirme';
    }

    public function isCancelled()
    {
        return $this->statut === 'annuler';
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('statut', 'en_attente');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('statut', 'confirme');
    }

    public function scopeCancelled($query)
    {
        return $query->where('statut', 'annuler');
    }
}