<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProduitPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_produit',
        'id_price_methode',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:3',
    ];

    // Relations
    public function produit()
    {
        return $this->belongsTo(Produit::class, 'id_produit');
    }

    public function priceMethode()
    {
        return $this->belongsTo(PriceMethode::class, 'id_price_methode');
    }
}

