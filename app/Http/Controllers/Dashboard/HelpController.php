<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\View\View;

class HelpController extends Controller
{
    /**
     * Display help and FAQ page.
     */
    public function index(): View
    {
        return view('dashboard.help');
    }
}
