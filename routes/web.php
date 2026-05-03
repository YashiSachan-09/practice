<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\Api\AdminBannerController;
use App\Http\Controllers\Admin\Api\AdminCategoryController;
use App\Http\Controllers\Admin\Api\AdminCouponController;
use App\Http\Controllers\Admin\Api\AdminCustomerController;
use App\Http\Controllers\Admin\Api\AdminDashboardController;
use App\Http\Controllers\Admin\Api\AdminOrderController;
use App\Http\Controllers\Admin\Api\AdminProductController;
use App\Http\Controllers\Admin\Api\AdminReportController;
use App\Http\Controllers\Admin\Api\AdminReviewController;
use App\Http\Controllers\Admin\Api\AdminSettingController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\Shop\ShopAuthController;
use App\Http\Controllers\Shop\ShopBootstrapController;
use App\Http\Controllers\Shop\ShopCartController;
use App\Http\Controllers\Shop\ShopCatalogController;
use App\Http\Controllers\Shop\ShopCheckoutController;
use App\Http\Controllers\Shop\ShopOrderController;
use App\Http\Controllers\Shop\ShopRazorpayWebhookController;
use Illuminate\Support\Facades\Route;
use Illuminate\View\View;

Route::get('/', [GalleryController::class, 'index'])->name('home');
Route::get('/about', [GalleryController::class, 'about'])->name('about');
Route::get('/marketplace', [GalleryController::class, 'marketplace'])->name('marketplace');
Route::get('/artists', [GalleryController::class, 'artists'])->name('artists');
Route::get('/exhibitions', [GalleryController::class, 'exhibitions'])->name('exhibitions');
Route::get('/journal', [GalleryController::class, 'journal'])->name('journal');
Route::get('/contact', [GalleryController::class, 'contact'])->name('contact');
Route::post('/contact', [GalleryController::class, 'submitContact'])->name('contact.submit');

Route::get('/checkout', [CheckoutController::class, 'show'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'submit'])->name('checkout.submit');
Route::post('/checkout/razorpay/verify', [CheckoutController::class, 'verifyRazorpay'])->name('checkout.razorpay.verify');
Route::get('/order/confirmation/{order_number}', [CheckoutController::class, 'confirmation'])->name('order.confirmation');

Route::prefix('shop')->middleware('web')->name('shop.')->group(function (): void {
    Route::post('/webhooks/razorpay', ShopRazorpayWebhookController::class)->name('webhooks.razorpay');

    Route::prefix('api')->name('api.')->group(function (): void {
        Route::get('/bootstrap', ShopBootstrapController::class)->name('bootstrap');

        Route::get('/categories', [ShopCatalogController::class, 'categories'])->name('categories.index');
        Route::get('/products', [ShopCatalogController::class, 'products'])->name('products.index');
        Route::get('/products/{slug}', [ShopCatalogController::class, 'show'])->name('products.show');

        Route::get('/cart', [ShopCartController::class, 'index'])->name('cart.index');
        Route::post('/cart/items', [ShopCartController::class, 'store'])->name('cart.store');
        Route::patch('/cart/items/{cartItem}', [ShopCartController::class, 'update'])->name('cart.update');
        Route::delete('/cart/items/{cartItem}', [ShopCartController::class, 'destroy'])->name('cart.destroy');
        Route::delete('/cart', [ShopCartController::class, 'clear'])->name('cart.clear');

        Route::get('/checkout/preview', [ShopCheckoutController::class, 'preview'])->name('checkout.preview');
        Route::post('/checkout', [ShopCheckoutController::class, 'submit'])->name('checkout.submit');

        Route::post('/auth/register', [ShopAuthController::class, 'register'])->name('auth.register');
        Route::post('/auth/login', [ShopAuthController::class, 'login'])->name('auth.login');
        Route::post('/auth/logout', [ShopAuthController::class, 'logout'])->middleware('auth')->name('auth.logout');

        Route::middleware('auth')->group(function (): void {
            Route::get('/orders', [ShopOrderController::class, 'index'])->name('orders.index');
            Route::get('/orders/{order_number}', [ShopOrderController::class, 'show'])->name('orders.show');
        });
    });

    Route::view('/', 'shop.spa')->name('spa');
    Route::view('/{path}', 'shop.spa')->where('path', '^(?!api(?:/|$)).+')->name('page');
});

Route::prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminAuthController::class, 'login'])->name('login.attempt');

    Route::middleware(['auth', 'admin'])->group(function (): void {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
        Route::get('/', fn () => redirect()->route('admin.dashboard'));

        $spa = fn (): View => view('admin.spa');

        Route::get('/dashboard', $spa)->name('dashboard');
        Route::get('/products', $spa)->name('products.index');
        Route::get('/categories', $spa)->name('categories.index');
        Route::get('/orders', $spa)->name('orders.index');
        Route::get('/customers', $spa)->name('customers.index');
        Route::get('/coupons', $spa)->name('coupons.index');
        Route::get('/reports', $spa)->name('reports.index');
        Route::get('/reviews', $spa)->name('reviews.index');
        Route::get('/banners', $spa)->name('banners.index');
        Route::get('/settings', $spa)->name('settings.index');

        Route::prefix('api')->name('api.')->group(function (): void {
            Route::get('/dashboard/summary', [AdminDashboardController::class, 'summary'])->name('dashboard.summary');
            Route::get('/orders', [AdminOrderController::class, 'index'])->name('orders.index');
            Route::get('/orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
            Route::patch('/orders/{order}', [AdminOrderController::class, 'update'])->name('orders.update');

            Route::get('/categories', [AdminCategoryController::class, 'index'])->name('categories.index');
            Route::post('/categories', [AdminCategoryController::class, 'store'])->name('categories.store');
            Route::patch('/categories/{category}', [AdminCategoryController::class, 'update'])->name('categories.update');
            Route::delete('/categories/{category}', [AdminCategoryController::class, 'destroy'])->name('categories.destroy');

            Route::get('/customers', [AdminCustomerController::class, 'index'])->name('customers.index');
            Route::patch('/customers/{customer}', [AdminCustomerController::class, 'update'])->name('customers.update');

            Route::get('/coupons', [AdminCouponController::class, 'index'])->name('coupons.index');
            Route::post('/coupons', [AdminCouponController::class, 'store'])->name('coupons.store');
            Route::patch('/coupons/{coupon}', [AdminCouponController::class, 'update'])->name('coupons.update');
            Route::delete('/coupons/{coupon}', [AdminCouponController::class, 'destroy'])->name('coupons.destroy');

            Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
            Route::patch('/reviews/{review}', [AdminReviewController::class, 'update'])->name('reviews.update');

            Route::get('/banners', [AdminBannerController::class, 'index'])->name('banners.index');
            Route::post('/banners', [AdminBannerController::class, 'store'])->name('banners.store');
            Route::patch('/banners/{banner}', [AdminBannerController::class, 'update'])->name('banners.update');
            Route::delete('/banners/{banner}', [AdminBannerController::class, 'destroy'])->name('banners.destroy');

            Route::get('/settings', [AdminSettingController::class, 'show'])->name('settings.show');
            Route::patch('/settings', [AdminSettingController::class, 'update'])->name('settings.update');

            Route::get('/reports/summary', [AdminReportController::class, 'summary'])->name('reports.summary');
            Route::get('/reports/orders.csv', [AdminReportController::class, 'ordersCsv'])->name('reports.orders_csv');

            Route::get('/products', [AdminProductController::class, 'index'])->name('products.api.index');
            Route::post('/products', [AdminProductController::class, 'store'])->name('products.api.store');
            Route::get('/products/{product}', [AdminProductController::class, 'show'])->name('products.api.show');
            Route::patch('/products/{product}', [AdminProductController::class, 'update'])->name('products.api.update');
            Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])->name('products.api.destroy');
        });
    });
});
