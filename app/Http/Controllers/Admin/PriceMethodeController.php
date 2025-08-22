<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PriceMethode;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PriceMethodeController extends Controller
{
    /**
     * Afficher la liste des méthodes de prix
     */
    public function index(Request $request)
    {
        $query = PriceMethode::withCount('produitPrices');

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('methode_name', 'like', "%{$search}%");
        }

        $priceMethodes = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/PriceMethodes/Index', [
            'priceMethodes' => $priceMethodes,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        return Inertia::render('Admin/PriceMethodes/Create');
    }

    /**
     * Enregistrer une nouvelle méthode de prix
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'methode_name' => ['required', 'string', 'max:100', 'unique:price_methodes'],
        ]);

        PriceMethode::create($validated);

        return redirect()->route('admin.price-methodes.index')
                        ->with('message', 'Méthode de paiement créée avec succès !');
    }

    /**
     * Afficher le formulaire d'édition
     */
    public function edit(PriceMethode $priceMethode)
    {
        return Inertia::render('Admin/PriceMethodes/Edit', [
            'priceMethode' => $priceMethode
        ]);
    }

    /**
     * Mettre à jour une méthode de prix
     */
    public function update(Request $request, PriceMethode $priceMethode)
    {
        $validated = $request->validate([
            'methode_name' => ['required', 'string', 'max:100', Rule::unique('price_methodes')->ignore($priceMethode->id)],
        ]);

        $priceMethode->update($validated);

        return redirect()->route('admin.price-methodes.index')
                        ->with('message', 'Méthode de paiement mise à jour avec succès !');
    }

    /**
     * Supprimer une méthode de prix
     */
    public function destroy(PriceMethode $priceMethode)
    {
        $produitsCount = $priceMethode->produitPrices()->count();
        
        // Si la méthode a des produits associés, supprimer d'abord les relations
        if ($produitsCount > 0) {
            // Supprimer les prix des produits associés à cette méthode
            $priceMethode->produitPrices()->delete();
        }
        
        // Supprimer la méthode de paiement
        $priceMethode->delete();

        return redirect()->route('admin.price-methodes.index')
                        ->with('message', $produitsCount > 0 
                            ? "Méthode de paiement supprimée avec succès ! {$produitsCount} prix de produit(s) ont été supprimés."
                            : 'Méthode de paiement supprimée avec succès !');
    }
}