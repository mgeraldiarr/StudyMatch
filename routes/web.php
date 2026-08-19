<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'index'])->name('landing');

Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
Route::get('/setup-profile', [AuthController::class, 'setupProfile'])->name('auth.setup-profile');

Route::get('/discovery', [DashboardController::class, 'discovery'])->name('dashboard.discovery');
Route::get('/community', [DashboardController::class, 'community'])->name('dashboard.community');
Route::get('/chat', [DashboardController::class, 'chat'])->name('dashboard.chat');
Route::get('/notification', [DashboardController::class, 'notification'])->name('dashboard.notification');
Route::get('/schedule', [DashboardController::class, 'schedule'])->name('dashboard.schedule');
Route::get('/settings', [DashboardController::class, 'settings'])->name('dashboard.settings');
Route::get('/user-profile', [DashboardController::class, 'userProfile'])->name('dashboard.user-profile');
Route::get('/help', [DashboardController::class, 'help'])->name('dashboard.help');
