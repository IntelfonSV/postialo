<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\User;
use App\Models\Template;
use App\Models\AiUsage;
use Illuminate\Support\Facades\DB;


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

        // Obtener uso de tokens por mes
        $tokenUsageByMonth = AiUsage::select(
                DB::raw('TO_CHAR(created_at, \'YYYY-MM\') as month'),
                DB::raw('SUM(total_tokens) as total_tokens'),
                DB::raw('SUM(prompt_tokens) as prompt_tokens'),
                DB::raw('SUM(candidates_tokens) as candidates_tokens')
            )
            ->when(!$user->hasRole('admin'), function ($query) use ($user) {
                return $query->where('user_id', $user->id);
            })
            ->where('created_at', '>=', now()->subMonths(12))
            ->groupBy(DB::raw('TO_CHAR(created_at, \'YYYY-MM\')'))
            ->orderBy('month')
            ->get();

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
            'tokenUsageByMonth' => $tokenUsageByMonth,
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
