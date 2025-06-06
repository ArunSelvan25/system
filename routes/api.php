<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleAndPermissionController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/get-roles', [RoleAndPermissionController::class, 'index'])
    ->name('api.roles.index')
    ->middleware('auth');
