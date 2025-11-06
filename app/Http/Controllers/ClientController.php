<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia; 

class ClientController extends Controller
{
    
    public function index()
    {
        return view('clients.index');
    }
    
    public function create()
    {
        return Inertia::render('Clients/Create');
    }
    
}
