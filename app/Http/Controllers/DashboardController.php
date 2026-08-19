<?php

namespace App\Http\Controllers;

class DashboardController extends Controller
{
    public function discovery()
    {
        return view('dashboard.discovery');
    }

    public function community()
    {
        return view('dashboard.community');
    }

    public function chat()
    {
        return view('dashboard.chat');
    }

    public function notification()
    {
        return view('dashboard.notification');
    }

    public function schedule()
    {
        return view('dashboard.schedule');
    }

    public function settings()
    {
        return view('dashboard.settings');
    }

    public function userProfile()
    {
        return view('dashboard.user-profile');
    }

    public function help()
    {
        return view('dashboard.help');
    }
}
