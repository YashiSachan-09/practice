<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Seed products from config/storefront.php catalog (DB is source of truth for the React shop).
     */
    public function run(): void
    {
        $catalog = config('storefront.catalog', []);
        if ($catalog === []) {
            return;
        }

        $defaultCategory = Category::query()->where('slug', 'gallery-editions')->first()
            ?? Category::query()->where('is_active', true)->orderBy('sort_order')->first();

        $images = [
            'CV-DN-01' => 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80',
            'LT-MN-14' => 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&q=80',
            'FR-OK-M' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
            'CV-MN-09' => 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=80',
            'SC-WV-03' => 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1200&q=80',
            'PR-GS-22' => 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
        ];

        foreach ($catalog as $sku => $meta) {
            if (! is_array($meta) || ! isset($meta['name'], $meta['unit_price'])) {
                continue;
            }

            $name = (string) $meta['name'];
            $price = (float) $meta['unit_price'];
            $baseSlug = Str::slug($name.'-'.$sku);

            Product::query()->updateOrCreate(
                ['sku' => $sku],
                [
                    'category_id' => $defaultCategory?->id,
                    'slug' => Str::substr($baseSlug, 0, 160),
                    'name' => $name,
                    'description' => null,
                    'unit_price' => $price,
                    'image_url' => $images[$sku] ?? null,
                    'stock_quantity' => 999,
                    'is_active' => true,
                    'sort_order' => 0,
                ]
            );
        }
    }
}
