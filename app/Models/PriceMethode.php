<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceMethode extends Model
{
    use HasFactory;

    protected $fillable = [
        'methode_name',
    ];

    // Relations
    public function produitPrices()
    {
        return $this->hasMany(ProduitPrice::class, 'id_price_methode');
    }

}
