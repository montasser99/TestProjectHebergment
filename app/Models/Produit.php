<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'description',
        'image',
        'quantity',
        'unit',
        'currency',
        'type_produit_id',
    ];

    // Relations
    public function typeProduit()
    {
        return $this->belongsTo(TypeProduit::class);
    }

    public function produitPrices()
    {
        return $this->hasMany(ProduitPrice::class, 'id_produit');
    }

    public function contactSocialMedia()
    {
        return $this->hasOne(ContactSocialMedia::class, 'id_produit');
    }

    // SUPPRIMÉ: relation commandeProduits car produit_id n'existe plus dans commande_produits

    // Helper pour obtenir le prix selon la méthode de paiement
    public function getPriceByMethod($methodId)
    {
        return $this->produitPrices()
                    ->where('id_price_methode', $methodId)
                    ->first()?->price;
    }

    // Helper pour obtenir tous les prix disponibles
    public function getAllPrices()
    {
        return $this->produitPrices()->with('priceMethode')->get();
    }
}