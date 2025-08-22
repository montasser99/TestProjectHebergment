<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TypeProduit;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class TypeProduitController extends Controller
{
    /**
     * Afficher la liste des types de produits
     */
    public function index(Request $request)
    {
        $query = TypeProduit::withCount('produits');

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        $typeProduits = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/TypeProduits/Index', [
            'typeProduits' => $typeProduits,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        return Inertia::render('Admin/TypeProduits/Create');
    }

    /**
     * Enregistrer un nouveau type de produit
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:type_produits'],
        ]);

        TypeProduit::create($validated);

        return redirect()->route('admin.type-produits.index')
                        ->with('message', 'Type de produit créé avec succès !');
    }

    /**
     * Afficher le formulaire d'édition
     */
    public function edit(TypeProduit $typeProduit)
    {
        return Inertia::render('Admin/TypeProduits/Edit', [
            'typeProduit' => $typeProduit
        ]);
    }

    /**
     * Mettre à jour un type de produit
     */
    public function update(Request $request, TypeProduit $typeProduit)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('type_produits')->ignore($typeProduit->id)],
        ]);

        $typeProduit->update($validated);

        return redirect()->route('admin.type-produits.index')
                        ->with('message', 'Type de produit mis à jour avec succès !');
    }

    /**
     * Supprimer un type de produit
     */
    public function destroy(Request $request, TypeProduit $typeProduit)
    {
        $produitsCount = $typeProduit->produits()->count();
        
        // Grâce à la contrainte "onDelete('set null')", 
        // MySQL va automatiquement mettre type_produit_id à NULL
        $typeProduit->delete();

        return redirect()->route('admin.type-produits.index')
                        ->with('message', $produitsCount > 0 
                            ? "Type de produit supprimé avec succès ! {$produitsCount} produit(s) n'ont plus de type assigné." 
                            : 'Type de produit supprimé avec succès !');
    }
}