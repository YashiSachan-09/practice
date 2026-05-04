<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AdminProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max($request->integer('per_page', 30), 5), 200);
        $q = Product::query()->with(['category:id,name,slug']);

        if ($request->filled('category_id')) {
            $q->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('active_only')) {
            $q->where('is_active', $request->boolean('active_only'));
        }

        if ($needle = $request->string('q')->trim()->toString()) {
            $like = '%'.$needle.'%';
            $q->where(fn ($w) => $w->where('name', 'like', $like)
                ->orWhere('sku', 'like', $like));
        }

        $paginator = $q->orderBy('sort_order')->orderBy('name')->paginate($perPage);
        $paginator->through(fn (Product $p) => $this->transform($p));

        return response()->json($paginator);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'data' => $this->transform($product->loadMissing('category')),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'sku' => ['required', 'string', 'max:80', Rule::unique('products', 'sku')],
            'slug' => ['nullable', 'string', 'max:160', Rule::unique('products', 'slug')],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:65000'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'stock_quantity' => ['nullable', 'integer', 'min:0', 'max:999999'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:65000'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
        ]);

        $validated['slug'] = $this->makeUniqueSlug($validated['slug'] ?? null, (string) $validated['name'], (string) $validated['sku']);

        $product = Product::query()->create($validated);

        return response()->json(['data' => $this->transform($product->loadMissing('category'))], 201);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'sku' => ['sometimes', 'string', 'max:80', Rule::unique('products', 'sku')->ignore($product->id)],
            'slug' => ['sometimes', 'string', 'max:160', Rule::unique('products', 'slug')->ignore($product->id)],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:65000'],
            'unit_price' => ['sometimes', 'numeric', 'min:0'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'stock_quantity' => ['nullable', 'integer', 'min:0', 'max:999999'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:65000'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'stock_update_reason' => ['nullable', 'string', 'max:100'],
            'stock_update_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        if (array_key_exists('stock_update_reason', $validated)) {
            $product->stock_update_reason = $validated['stock_update_reason'];
            unset($validated['stock_update_reason']);
        }
        if (array_key_exists('stock_update_notes', $validated)) {
            $product->stock_update_notes = $validated['stock_update_notes'];
            unset($validated['stock_update_notes']);
        }

        if (array_key_exists('slug', $validated) || array_key_exists('name', $validated)) {
            $validated['slug'] = $this->makeUniqueSlug(
                $validated['slug'] ?? $product->slug,
                (string) ($validated['name'] ?? $product->name),
                (string) ($validated['sku'] ?? $product->sku),
                $product->id
            );
        }

        $product->fill($validated);
        $product->save();

        return response()->json([
            'data' => $this->transform($product->fresh()->loadMissing('category')),
            'message' => __('Product updated.'),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => __('Product deleted.')]);
    }

    public function stockHistory(Product $product): JsonResponse
    {
        $history = $product->stockMovements()
            ->with('user:id,name')
            ->latest()
            ->paginate(30);

        return response()->json($history);
    }

    private function makeUniqueSlug(?string $slug, string $name, string $sku, ?int $ignoreProductId = null): string
    {
        $base = $slug !== null && $slug !== ''
            ? Str::slug($slug)
            : Str::slug($name.'-'.$sku);

        $base = Str::limit($base, 150, '');

        $candidate = $base;
        $i = 1;
        while (Product::query()
            ->when($ignoreProductId !== null, fn ($q) => $q->where('id', '!=', $ignoreProductId))
            ->where('slug', $candidate)
            ->exists()) {
            $candidate = Str::limit($base.'-'.$i, 160, '');
            $i++;
        }

        return $candidate;
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(Product $p): array
    {
        return [
            'id' => $p->id,
            'category_id' => $p->category_id,
            'sku' => $p->sku,
            'slug' => $p->slug,
            'name' => $p->name,
            'description' => $p->description,
            'unit_price' => (float) $p->unit_price,
            'image_url' => $p->image_url,
            'stock_quantity' => $p->stock_quantity,
            'low_stock_threshold' => $p->low_stock_threshold,
            'is_low_stock' => $p->isLowStock(),
            'is_active' => (bool) $p->is_active,
            'sort_order' => $p->sort_order,
            'meta_title' => $p->meta_title,
            'meta_description' => $p->meta_description,
            'meta_keywords' => $p->meta_keywords,
            'category' => $p->relationLoaded('category') && $p->category
                ? ['id' => $p->category->id, 'name' => $p->category->name, 'slug' => $p->category->slug]
                : null,
        ];
    }
}
