<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommandeProduit extends Model
{
    use HasFactory;

    protected $fillable = [
        'commande_id',
        // SUPPRIMÉ: 'produit_id' car n'existe plus selon vos corrections
        'produit_label',
        'produit_description',
        'produit_image',
        'produit_quantity',
        'produit_unit',
        'produit_currency',
        'prix_unitaire',
        'quantite_commandee',
        'sous_total',
    ];

    protected $casts = [
        'prix_unitaire' => 'decimal:3',
        'sous_total' => 'decimal:3',
    ];

    // Relations
    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    // SUPPRIMÉ: relation produit car produit_id n'existe plus
}