<?php

use App\Http\Controllers\OwnerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleAndPermissionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function() {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::apiResource('role-permission', RoleAndPermissionController::class);
    Route::get('/roles/datatable', [RoleAndPermissionController::class, 'datatable'])->name('roles.datatable');
    Route::put('/roles/{id}', [RoleAndPermissionController::class, 'update'])->name('roles.update');

    Route::apiResource('owner', OwnerController::class);
    // Route::post('/owners', [OwnerController::class, 'store'])->name('owner.store');
    Route::get('/users/datatable', [OwnerController::class, 'datatable'])->name('users.datatable');
    Route::get('/property/type-list', [OwnerController::class, 'listPropertyTypes'])->name('property-type.list');
    Route::get('/property/list', [OwnerController::class, 'propertyList'])->name('property.list');
    Route::post('/property/store', [OwnerController::class, 'propertyCreate'])->name('property.store');


    Route::get('/get-roles', [RoleAndPermissionController::class, 'listRoles'])->name('roles.list.roles');


});

require __DIR__.'/auth.php';
