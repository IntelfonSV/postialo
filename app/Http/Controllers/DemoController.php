<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DemoController extends Controller
{
    public function index()
    {
        return Inertia::render('Demo/Index');
    }

    public function store(Request $request)
    {
        
    }

    public function guide()
    {
        return Inertia::render('Demos/Guide');
    }

    public function destroy($id)
    {
        
    }

    public function update(Request $request, $id)
    {
        
    }

    public function show($id)
    {
        
    }

}
