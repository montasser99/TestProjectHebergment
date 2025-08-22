<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactSocialMedia extends Model
{
    use HasFactory;

    // Spécifier explicitement le nom de la table
    protected $table = 'contact_social_medias';

    protected $fillable = [
        'id_produit',
        'instagram_page',
        'facebook_page',
        'whatsapp_number',
        'tiktok_page',
    ];

    // Relations
    public function produit()
    {
        return $this->belongsTo(Produit::class, 'id_produit');
    }

    // Helper pour obtenir les contacts disponibles
    public function getAvailableContacts()
    {
        $contacts = [];
        
        if ($this->whatsapp_number) {
            $contacts['WhatsApp'] = $this->whatsapp_number;
        }
        if ($this->instagram_page) {
            $contacts['Instagram'] = $this->instagram_page;
        }
        if ($this->facebook_page) {
            $contacts['Facebook'] = $this->facebook_page;
        }
        if ($this->tiktok_page) {
            $contacts['TikTok'] = $this->tiktok_page;
        }

        return $contacts;
    }
}