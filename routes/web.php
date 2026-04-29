<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\GalleryController;
use Illuminate\Support\Facades\Route;

Route::get('/', [GalleryController::class, 'index'])->name('home');
Route::get('/about', [GalleryController::class, 'about'])->name('about');
Route::get('/marketplace', [GalleryController::class, 'marketplace'])->name('marketplace');
Route::get('/artists', [GalleryController::class, 'artists'])->name('artists');
Route::get('/exhibitions', [GalleryController::class, 'exhibitions'])->name('exhibitions');
Route::get('/journal', [GalleryController::class, 'journal'])->name('journal');
Route::get('/contact', [GalleryController::class, 'contact'])->name('contact');
Route::post('/contact', [GalleryController::class, 'submitContact'])->name('contact.submit');

Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.attempt');
    Route::middleware(['auth', 'admin'])->group(function (): void {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });
});
