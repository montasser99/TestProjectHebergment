<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\TypeProduit;
use App\Models\PriceMethode;
use App\Models\ContactSocialMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProduitController extends Controller
{
    /**
     * Afficher la liste des produits
     */
    public function index(Request $request)
    {
        $query = Produit::with(['typeProduit', 'contactSocialMedia'])
                        ->withCount('produitPrices');

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('label', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtrage par type de produit
        if ($request->filled('type_produit_id')) {
            $query->where('type_produit_id', $request->type_produit_id);
        }

        $produits = $query->latest()->paginate(10)->withQueryString();

        // Récupérer tous les types pour le filtre
        $typeProduits = TypeProduit::orderBy('name')->get();

        return Inertia::render('Admin/Produits/Index', [
            'produits' => $produits,
            'typeProduits' => $typeProduits,
            'filters' => $request->only(['search', 'type_produit_id']),
        ]);
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        $typeProduits = TypeProduit::orderBy('name')->get();
        $priceMethodes = PriceMethode::orderBy('methode_name')->get();

        return Inertia::render('Admin/Produits/Create', [
            'typeProduits' => $typeProduits,
            'priceMethodes' => $priceMethodes,
        ]);
    }

    /**
     * Enregistrer un nouveau produit
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'quantity' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'currency' => ['nullable', 'string', 'max:10'],
            'type_produit_id' => ['required', 'exists:type_produits,id'],
            
            // Prix pour chaque méthode
            'prices' => ['required', 'array'],
            'prices.*.price_methode_id' => ['required', 'exists:price_methodes,id'],
            'prices.*.price' => ['required', 'numeric', 'min:0'],
            
            // Contact social media (optionnel)
            'contact.instagram_page' => ['nullable', 'string', 'max:255'],
            'contact.facebook_page' => ['nullable', 'string', 'max:255'],
            'contact.whatsapp_number' => ['nullable', 'string', 'max:20'],
            'contact.tiktok_page' => ['nullable', 'string', 'max:255'],
        ]);

        // Gestion de l'image
        $imagePath = null;
        if ($request->hasFile('image')) {
            try {
                $file = $request->file('image');
                // Vérifier que le fichier est valide
                if ($file->isValid()) {
                    $imagePath = $file->store('produits', 'public');
                } else {
                    return back()->withErrors(['image' => 'Le fichier image n\'est pas valide.']);
                }
            } catch (\Exception $e) {
                return back()->withErrors(['image' => 'Erreur lors de l\'upload: ' . $e->getMessage()]);
            }
        }

        // Créer le produit
        $produit = Produit::create([
            'label' => $validated['label'],
            'description' => $validated['description'],
            'image' => $imagePath,
            'quantity' => $validated['quantity'],
            'unit' => $validated['unit'],
            'currency' => $validated['currency'] ?? 'TND',
            'type_produit_id' => $validated['type_produit_id'],
        ]);

        // Créer les prix pour chaque méthode
        foreach ($validated['prices'] as $priceData) {
            $produit->produitPrices()->create([
                'id_price_methode' => $priceData['price_methode_id'],
                'price' => $priceData['price'],
            ]);
        }

        // Créer le contact social media si au moins un champ est rempli
        $contactData = $validated['contact'] ?? [];
        $hasContactData = array_filter($contactData);
        
        if (!empty($hasContactData)) {
            $produit->contactSocialMedia()->create(array_merge([
                'instagram_page' => null,
                'facebook_page' => null,
                'whatsapp_number' => null,
                'tiktok_page' => null,
            ], $contactData));
        }

        return redirect()->route('admin.produits.index')
                        ->with('message', 'Produit créé avec succès !');
    }

    /**
     * Afficher un produit
     */
    public function show(Produit $produit)
    {
        $produit->load(['typeProduit', 'contactSocialMedia', 'produitPrices.priceMethode']);

        return Inertia::render('Admin/Produits/Show', [
            'produit' => $produit,
        ]);
    }

    /**
     * Afficher le formulaire d'édition
     */
    public function edit(Produit $produit)
    {
        $produit->load(['typeProduit', 'contactSocialMedia', 'produitPrices.priceMethode']);
        $typeProduits = TypeProduit::orderBy('name')->get();
        $priceMethodes = PriceMethode::orderBy('methode_name')->get();

        return Inertia::render('Admin/Produits/Edit', [
            'produit' => $produit,
            'typeProduits' => $typeProduits,
            'priceMethodes' => $priceMethodes,
        ]);
    }

    /**
     * Mettre à jour un produit
     */
    public function update(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'label' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'],
            'quantity' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'currency' => ['nullable', 'string', 'max:10'],
            'type_produit_id' => ['required', 'exists:type_produits,id'],
            
            // Prix pour chaque méthode
            'prices' => ['required', 'array'],
            'prices.*.price_methode_id' => ['required', 'exists:price_methodes,id'],
            'prices.*.price' => ['required', 'numeric', 'min:0'],
            
            // Contact social media (optionnel)
            'contact.instagram_page' => ['nullable', 'string', 'max:255'],
            'contact.facebook_page' => ['nullable', 'string', 'max:255'],
            'contact.whatsapp_number' => ['nullable', 'string', 'max:20'],
            'contact.tiktok_page' => ['nullable', 'string', 'max:255'],
        ]);

        // Gestion de l'image
        $imagePath = $produit->image;
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($produit->image) {
                Storage::disk('public')->delete($produit->image);
            }
            $imagePath = $request->file('image')->store('produits', 'public');
        }

        // Mettre à jour le produit
        $produit->update([
            'label' => $validated['label'],
            'description' => $validated['description'],
            'image' => $imagePath,
            'quantity' => $validated['quantity'],
            'unit' => $validated['unit'],
            'currency' => $validated['currency'] ?? 'TND',
            'type_produit_id' => $validated['type_produit_id'],
        ]);

        // Mettre à jour les prix - supprimer les anciens et créer les nouveaux
        $produit->produitPrices()->delete();
        foreach ($validated['prices'] as $priceData) {
            $produit->produitPrices()->create([
                'id_price_methode' => $priceData['price_methode_id'],
                'price' => $priceData['price'],
            ]);
        }

        // Mettre à jour le contact social media
        $contactData = $validated['contact'] ?? [];
        $hasContactData = array_filter($contactData);
        
        if (!empty($hasContactData)) {
            $produit->contactSocialMedia()->updateOrCreate(
                ['id_produit' => $produit->id],
                array_merge([
                    'instagram_page' => null,
                    'facebook_page' => null,
                    'whatsapp_number' => null,
                    'tiktok_page' => null,
                ], $contactData)
            );
        } else {
            // Supprimer le contact si aucun champ n'est rempli
            $produit->contactSocialMedia()->delete();
        }

        return redirect()->route('admin.produits.index')
                        ->with('message', 'Produit mis à jour avec succès !');
    }

    /**
     * Supprimer un produit
     */
    public function destroy(Produit $produit)
    {
        // Supprimer l'image
        if ($produit->image) {
            Storage::disk('public')->delete($produit->image);
        }

        // Supprimer les relations
        $produit->produitPrices()->delete();
        $produit->contactSocialMedia()->delete();
        
        // Supprimer le produit
        $produit->delete();

        return redirect()->route('admin.produits.index')
                        ->with('message', 'Produit supprimé avec succès !');
    }
}