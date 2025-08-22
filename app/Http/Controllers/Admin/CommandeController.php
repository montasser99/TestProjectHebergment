<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommandeController extends Controller
{
    /**
     * Afficher la liste des commandes
     */
    public function index(Request $request)
    {
        $query = Commande::with(['user', 'commandeProduits'])
            ->orderBy('created_at', 'desc');

        // Filtrage par statut
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        // Recherche par nom d'utilisateur ou email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtrage par date
        if ($request->filled('date_from')) {
            $query->whereDate('date_commande', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('date_commande', '<=', $request->date_to);
        }

        $commandes = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Commandes/Index', [
            'commandes' => $commandes,
            'filters' => $request->only(['statut', 'search', 'date_from', 'date_to'])
        ]);
    }

    /**
     * Afficher les détails d'une commande
     */
    public function show(Commande $commande)
    {
        $commande->load(['user', 'commandeProduits']);

        return Inertia::render('Admin/Commandes/Show', [
            'commande' => $commande
        ]);
    }

    /**
     * Confirmer une commande
     */
    public function confirm(Request $request, Commande $commande)
    {
        if ($commande->statut !== 'en_attente') {
            return back()->with('error', 'Cette commande ne peut pas être confirmée');
        }

        $commande->update([
            'statut' => 'confirme',
            'date_confirmation' => now(),
            'notes_admin' => $request->notes_admin
        ]);

        return back()->with('message', 'Commande confirmée avec succès');
    }

    /**
     * Annuler une commande
     */
    public function cancel(Request $request, Commande $commande)
    {
        if ($commande->statut === 'annuler') {
            return back()->with('error', 'Cette commande est déjà annulée');
        }

        $commande->update([
            'statut' => 'annuler',
            'notes_admin' => $request->notes_admin
        ]);

        return back()->with('message', 'Commande annulée avec succès');
    }

    /**
     * Mettre à jour les notes admin
     */
    public function updateNotes(Request $request, Commande $commande)
    {
        $request->validate([
            'notes_admin' => 'nullable|string|max:1000'
        ]);

        $commande->update([
            'notes_admin' => $request->notes_admin
        ]);

        return back()->with('message', 'Notes mises à jour avec succès');
    }
}
