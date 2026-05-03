<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopCatalogController extends Controller
{
    public function categories(): JsonResponse
    {
        $rows = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description']);

        return response()->json(['data' => $rows]);
    }

    public function products(Request $request): JsonResponse
    {
        $request->merge([
            'per_page' => min(max((int) $request->query('per_page', 24), 1), 60),
        ]);

        $q = Product::query()
            ->where('is_active', true)
            ->with(['category:id,name,slug']);

        if ($slug = $request->string('category')->trim()->toString()) {
            $q->whereHas('category', fn ($c) => $c->where('slug', $slug));
        }

        if ($needle = $request->string('q')->trim()->toString()) {
            $needleLike = '%'.$needle.'%';
            $q->where(function ($w) use ($needleLike): void {
                $w->where('name', 'like', $needleLike)
                    ->orWhere('description', 'like', $needleLike)
                    ->orWhere('sku', 'like', $needleLike);
            });
        }

        $paginator = $q->orderBy('sort_order')->orderBy('name')->paginate((int) $request->query('per_page'));

        $paginator->through(fn (Product $p) => $this->transformProduct($p));

        return response()->json($paginator);
    }

    public function show(string $slug): JsonResponse
    {
        /** @var Product $product */
        $product = Product::query()
            ->where('is_active', true)
            ->where('slug', $slug)
            ->with(['category:id,name,slug'])
            ->firstOrFail();

        return response()->json([
            'data' => $this->transformProduct($product),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformProduct(Product $p): array
    {
        return [
            'id' => $p->id,
            'sku' => $p->sku,
            'slug' => $p->slug,
            'name' => $p->name,
            'description' => $p->description,
            'unit_price' => (float) $p->unit_price,
            'image_url' => $p->image_url,
            'stock_quantity' => $p->stock_quantity,
            'category' => $p->relationLoaded('category') && $p->category
                ? [
                    'name' => $p->category->name,
                    'slug' => $p->category->slug,
                ]
                : null,
        ];
    }
}
