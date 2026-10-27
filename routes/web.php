<?php

use App\Http\Controllers\LeadController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('leads.index');
})->middleware('auth');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Lead Management
    |--------------------------------------------------------------------------
    */

    Route::controller(LeadController::class)
        ->prefix('leads')
        ->name('leads.')
        ->group(function () {

            // List leads, search, filter and sort
            Route::get('/', 'index')->name('index');

            // Apply filters without URL query parameters
            Route::post('/filter', 'filter')->name('filter');

            // Reset filters
            Route::post('/reset-filters', 'resetFilters')
                ->name('resetFilters');

            // Create lead
            Route::get('/create', 'create')->name('create');
            Route::post('/', 'store')->name('store');

            // Edit and update lead
            Route::get('/{lead}/edit', 'edit')->name('edit');
            Route::put('/{lead}', 'update')->name('update');

            // Delete lead
            Route::delete('/{lead}', 'destroy')->name('destroy');
        });

    /*
    |--------------------------------------------------------------------------
    | Profile Management
    |--------------------------------------------------------------------------
    */

    Route::controller(ProfileController::class)
        ->prefix('profile')
        ->name('profile.')
        ->group(function () {

            Route::get('/', 'edit')->name('edit');
            Route::patch('/', 'update')->name('update');
            Route::delete('/', 'destroy')->name('destroy');
        });
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
|
| Provides login, registration, logout, password reset, and other
| authentication routes configured by your Laravel starter kit.
|
*/

require __DIR__ . '/auth.php';
