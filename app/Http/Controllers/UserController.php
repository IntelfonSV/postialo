<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use App\Models\Template;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();

        return Inertia::render('Users/Index', [
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles,
                    'hasActivePayment' => $user->hasActivePayment(),
                    'hasActiveDemo' => $user->hasActiveDemo(),
                ];
            }),
        ]);
    }

    public function show(User $user)
    {
        //count por estado y mes 
        $user->load('roles');
        $schedules = Schedule::where('user_id', $user->id)->orderBy('id', 'asc')->get();
        $schedules_count = $schedules->count();
        $schedules_pending = $schedules->where('status', 'pending')->count();
        $schedules_in_progress = $schedules->where('status', 'in_progress')->count();
        $schedules_generated = $schedules->where('status', 'generated')->count();
        $schedules_approved = $schedules->where('status', 'approved')->count();
        $schedules_published = $schedules->where('status', 'published')->count();
        $templates_count = Template::where('user_id', $user->id)->count();
        $payments = $user->payments()->orderBy('id', 'asc')->get();
        
        
        return Inertia::render('Users/Show', [
            'user' => $user,
            'schedules_count' => $schedules_count,
            'schedules_pending' => $schedules_pending,
            'schedules_in_progress' => $schedules_in_progress,
            'schedules_generated' => $schedules_generated,
            'schedules_approved' => $schedules_approved,
            'schedules_published' => $schedules_published,
            'templates_count' => $templates_count,
            'payments' => $payments,  
            'demo' => $user->demos()->where('valid_until', '>=', now())->first(),
            'hasActivePayment' => $user->hasActivePayment(),
        ]);
    }

    public function destroy(User $user, Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password']
        ]);
        $user->delete();
        return redirect()->route('users.index')->with('success', 'Usuario eliminado exitosamente.');
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => Role::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'make_url' => 'nullable|string',
            'roles' => 'required|array'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'make_url'=> $request->make_url,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->roles);

        return redirect()->route('users.index')->with('success', 'Usuario creado exitosamente.');
    }

    public function edit(User $user)
    {
        $user->load('roles');
        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => Role::all(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'make_url'=>'nullable|string',
            'password' => 'nullable|string|min:8',
            'roles' => 'required|array'
        ]);

        $updateData = [
            'name' => $request->name,
            'make_url'=>$request->make_url,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        $user->syncRoles($request->roles);

        return redirect()->route('users.index')->with('success', 'Usuario actualizado exitosamente.');
    }

    public function activateDemo(User $user)
    {
        $user->demos()->create([
            'valid_until' => now()->addDays(30),
        ]);
        return back()->with('success', 'Demo activado exitosamente.');
    }

    public function demo()
    {
        $user = auth()->user();
        if ($user->demos()->exists()) {
            return redirect(route('dashboard'))->with('error', 'Ya has utilizado tu demo.');
        }
        $user->demos()->create([
            'valid_until' => now()->addDays(30),
        ]);
        return redirect(route('dashboard'))->with('success', 'Demo activado exitosamente.');
    }
}
