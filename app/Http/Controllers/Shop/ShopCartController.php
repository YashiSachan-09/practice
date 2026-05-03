<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CartResolver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopCartController extends Controller
{
    private function transform(Request $request, CartResolver $resolver): JsonResponse
    {
        $cart = $resolver->cart()->load(['items.product']);
        $rows = [];

        foreach ($cart->items as $line) {
            $product = $line->product;
            $rows[] = [
                'id' => $line->id,
                'quantity' => $line->quantity,
                'product' => $product ? [
                    'slug' => $product->slug,
                    'sku' => $product->sku,
                    'name' => $product->name,
                    'unit_price' => (float) $product->unit_price,
                    'image_url' => $product->image_url,
                    'stock_quantity' => $product->stock_quantity,
                ] : null,
            ];
        }

        return response()->json([
            'data' => [
                'cart_id' => $cart->id,
                'items' => $rows,
            ],
        ]);
    }

    public function index(Request $request, CartResolver $resolver): JsonResponse
    {
        return $this->transform($request, $resolver);
    }

    public function store(Request $request, CartResolver $resolver): JsonResponse
    {
        $validated = $request->validate([
            'slug' => ['nullable', 'string', 'max:200'],
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:50'],
        ]);

        if (empty($validated['slug']) && empty($validated['product_id'])) {
            return response()->json(['message' => __('Specify product_id or slug.')], 422);
        }

        $productQuery = Product::query()->where('is_active', true);
        if (! empty($validated['product_id'])) {
            /** @var Product $product */
            $product = (clone $productQuery)->whereKey($validated['product_id'])->firstOrFail();
        } else {
            /** @var Product $product */
            $product = (clone $productQuery)->where('slug', $validated['slug'])->firstOrFail();
        }

        $cart = $resolver->cart();
        $line = $cart->items()->firstOrNew(['product_id' => $product->id]);
        $prev = (int) $line->quantity;
        $line->quantity = min(50, $prev + (int) $validated['quantity']);
        $line->save();

        return $this->transform($request, $resolver);
    }

    public function update(Request $request, int $cartItem, CartResolver $resolver): JsonResponse
    {
        $cart = $resolver->cart();
        $line = $cart->items()->whereKey($cartItem)->firstOrFail();

        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:1', 'max:50'],
        ]);

        $line->quantity = $validated['quantity'];
        $line->save();

        return $this->transform($request, $resolver);
    }

    public function destroy(int $cartItem, CartResolver $resolver): JsonResponse
    {
        $cart = $resolver->cart();
        $cart->items()->whereKey($cartItem)->delete();

        return $this->transform(request(), $resolver);
    }

    public function clear(CartResolver $resolver): JsonResponse
    {
        $cart = $resolver->cart();
        $cart->items()->delete();

        return $this->transform(request(), $resolver);
    }
}
