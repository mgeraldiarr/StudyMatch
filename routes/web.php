<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Dashboard\ChatController;
use App\Http\Controllers\Dashboard\CommunityController;
use App\Http\Controllers\Dashboard\DiscoveryController;
use App\Http\Controllers\Dashboard\HelpController;
use App\Http\Controllers\Dashboard\NotificationController;
use App\Http\Controllers\Dashboard\ProfileController;
use App\Http\Controllers\Dashboard\ScheduleController;
use App\Http\Controllers\Dashboard\SettingsController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [LandingController::class, 'index'])->name('landing');

/*
|--------------------------------------------------------------------------
| Guest Authentication Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'authenticate'])->name('login.post');
    Route::post('/register', [AuthController::class, 'register'])->name('register.post');
});

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    // Profile setup & onboarding
    Route::get('/setup-profile', [AuthController::class, 'setupProfile'])->name('auth.setup-profile');
    Route::post('/setup-profile', [AuthController::class, 'saveSetupProfile'])->name('auth.setup-profile.post');

    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');

    // Match Requests & Chat
    Route::post('/match-requests/{user}', [DiscoveryController::class, 'sendInvite'])->name('match-requests.send');
    Route::post('/match-requests/{matchRequest}/accept', [NotificationController::class, 'accept'])->name('match-requests.accept');
    Route::post('/match-requests/{matchRequest}/decline', [NotificationController::class, 'decline'])->name('match-requests.decline');
    Route::get('/discovery/candidates', [DiscoveryController::class, 'candidates'])->name('discovery.candidates');
    Route::get('/chat/messages/{user}', [ChatController::class, 'getMessages'])->name('chat.messages');
    Route::post('/chat/messages/{user}', [ChatController::class, 'sendMessage'])->name('chat.send');
    Route::get('/chat/group-messages/{course}', [ChatController::class, 'getGroupMessages'])->name('chat.group.messages');
    Route::post('/chat/group-messages/{course}', [ChatController::class, 'sendGroupMessage'])->name('chat.group.send');
    Route::delete('/chat/conversations/{user}', [ChatController::class, 'clearConversation'])->name('chat.clear');
    Route::delete('/chat/partners/{user}', [ChatController::class, 'removePartner'])->name('chat.remove');
    Route::get('/chat/contacts/{user}/info', [ChatController::class, 'getContactInfo'])->name('chat.contact.info');
    Route::get('/chat/groups/{course}/info', [ChatController::class, 'getGroupInfo'])->name('chat.group.info');
    Route::get('/chat/media', [ChatController::class, 'getSharedMedia'])->name('chat.media');
    Route::post('/chat/groups', [ChatController::class, 'createGroup'])->name('chat.groups.create');
    Route::post('/chat/groups/{course}/invite', [ChatController::class, 'inviteToGroup'])->name('chat.groups.invite');
    Route::post('/chat/report', [ChatController::class, 'submitReport'])->name('chat.report');
    Route::post('/chat/group-messages/{course}/update-info', [ChatController::class, 'updateGroupInfo'])->name('chat.group.update-info');
    Route::delete('/chat/group-messages/{course}/leave', [ChatController::class, 'leaveGroup'])->name('chat.group.leave');
    Route::post('/chat/upload-media', [ChatController::class, 'uploadMedia'])->name('chat.upload-media');

    // Community / Forum
    Route::post('/community/threads', [CommunityController::class, 'store'])->name('community.threads.store');
    Route::get('/community/threads/{thread}', [CommunityController::class, 'show'])->name('community.threads.show');
    Route::post('/community/threads/{thread}/replies', [CommunityController::class, 'reply'])->name('community.threads.reply');
    Route::post('/community/threads/{thread}/vote', [CommunityController::class, 'vote'])->name('community.threads.vote');

    // Schedule / Study Sessions
    Route::post('/schedule/sessions', [ScheduleController::class, 'store'])->name('schedule.sessions.store');
    Route::delete('/schedule/sessions/{session}', [ScheduleController::class, 'destroy'])->name('schedule.sessions.destroy');

    // Profile & Settings Updates
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/settings/account', [SettingsController::class, 'updateAccount'])->name('settings.account.update');
    Route::post('/settings/privacy', [SettingsController::class, 'updatePrivacy'])->name('settings.privacy.update');

    // Dashboard & feature pages
    Route::prefix('dashboard')->group(function () {
        Route::get('/discovery', [DiscoveryController::class, 'index'])->name('dashboard.discovery');
        Route::get('/community', [CommunityController::class, 'index'])->name('dashboard.community');
        Route::get('/chat', [ChatController::class, 'index'])->name('dashboard.chat');
        Route::get('/notification', [NotificationController::class, 'index'])->name('dashboard.notification');
        Route::get('/schedule', [ScheduleController::class, 'index'])->name('dashboard.schedule');
        Route::get('/settings', [SettingsController::class, 'index'])->name('dashboard.settings');
        Route::get('/user-profile', [ProfileController::class, 'index'])->name('dashboard.user-profile');
        Route::get('/help', [HelpController::class, 'index'])->name('dashboard.help');
    });

    // Root-level aliases for clean URLs
    Route::get('/discovery', [DiscoveryController::class, 'index']);
    Route::get('/community', [CommunityController::class, 'index']);
    Route::get('/chat', [ChatController::class, 'index']);
    Route::get('/notification', [NotificationController::class, 'index']);
    Route::get('/schedule', [ScheduleController::class, 'index']);
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::get('/user-profile', [ProfileController::class, 'index']);
    Route::get('/help', [HelpController::class, 'index']);
});
