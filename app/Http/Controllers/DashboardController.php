<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\User;
use App\Models\Template;


class DashboardController extends Controller
{
    public function index(){
        $user = auth()->user();
        if($user->hasRole('admin')) {
            $users_count = User::count();
            $schedules = Schedule::orderBy('id', 'asc')->get();
            $templates = Template::count();
        }else {

            $schedules = Schedule::where('user_id', $user->id)->orderBy('id', 'asc')->get();
            $templates = Template::where('user_id', $user->id)->count();
            $activeDemo = $user->demos()->where('valid_until', '>=', now())->first();
        }

        $schedules_count = $schedules->count();
        $schedules_pending = $schedules->where('status', 'pending')->count();
        $schedules_in_progress = $schedules->where('status', 'in_progress')->count();
        $schedules_generated = $schedules->where('status', 'generated')->count();
        $schedules_approved = $schedules->where('status', 'approved')->count();
        $schedules_published = $schedules->where('status', 'published')->count();
        $schedules_cancelled = $schedules->where('status', 'cancelled')->count();



        return Inertia::render('Dashboard', [
            'schedules_count' => $schedules_count,
            'schedules_pending' => $schedules_pending,
            'schedules_in_progress' => $schedules_in_progress,
            'schedules_generated' => $schedules_generated,
            'schedules_approved' => $schedules_approved,
            'schedules_published' => $schedules_published,
            'users_count' => $users_count ?? null,
            'templates_count' => $templates,
            'schedules_cancelled' => $schedules_cancelled,
            'activeDemo' => $activeDemo ?? null,
            ]); 
    }


    public function countByMonth(){
        $user = auth()->user();
        if($user->hasRole('admin')) {
            $schedules = Schedule::orderBy('id', 'asc')->get();
        }else {
            $schedules = Schedule::where('user_id', $user->id)->orderBy('id', 'asc')->get();
        }
        $schedules_count = $schedules->count();
        $schedules_pending = $schedules->where('status', 'pending')->count();
        $schedules_in_progress = $schedules->where('status', 'in_progress')->count();
        $schedules_generated = $schedules->where('status', 'generated')->count();
        $schedules_approved = $schedules->where('status', 'approved')->count();
        $schedules_published = $schedules->where('status', 'published')->count();
        return Inertia::render('Dashboard', [
            'schedules_count' => $schedules_count,
            'schedules_pending' => $schedules_pending,
            'schedules_in_progress' => $schedules_in_progress,
            'schedules_generated' => $schedules_generated,
            'schedules_approved' => $schedules_approved,
            'schedules_published' => $schedules_published,
        ]);
    }   
}
