<?php

namespace App\Observers;

use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;

class ProductObserver
{
    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        if ($product->stock_quantity > 0) {
            StockMovement::query()->create([
                'product_id' => $product->id,
                'user_id' => Auth::id(),
                'quantity_change' => $product->stock_quantity,
                'resulting_stock' => $product->stock_quantity,
                'reason_code' => 'initial_stock',
                'notes' => __('Initial stock on product creation.'),
            ]);
        }
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        if ($product->isDirty('stock_quantity')) {
            $oldStock = (int) $product->getOriginal('stock_quantity');
            $newStock = (int) $product->stock_quantity;
            $change = $newStock - $oldStock;

            StockMovement::query()->create([
                'product_id' => $product->id,
                'user_id' => Auth::id(),
                'quantity_change' => $change,
                'resulting_stock' => $newStock,
                'reason_code' => $product->stock_update_reason ?? 'manual_adjustment',
                'notes' => $product->stock_update_notes ?? null,
            ]);
        }
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "restored" event.
     */
    public function restored(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "force deleted" event.
     */
    public function forceDeleted(Product $product): void
    {
        //
    }
}
