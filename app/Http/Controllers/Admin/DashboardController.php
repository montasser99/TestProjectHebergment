<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('is_blocked', false)->count(),
            'blocked_users' => User::where('is_blocked', true)->count(),
            'admin_users' => User::where('role', 'admin')->count(),
            'recent_users' => User::latest()->take(5)->get(['id', 'name', 'email', 'created_at']),
            'users_today' => User::whereDate('created_at', today())->count(),
            'users_this_week' => User::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'users_this_month' => User::whereMonth('created_at', now()->month)->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}
