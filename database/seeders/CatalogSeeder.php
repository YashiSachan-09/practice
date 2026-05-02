<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Review;
use App\Models\SiteSetting;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        foreach ([
            ['Abstract Paintings', 'abstract-paintings', 'Curated abstract works for upscale interiors.', 10],
            ['Sculpture', 'sculpture', 'Editioned and one-of-one sculpture.', 20],
            ['Fine Art Prints', 'fine-art-prints', 'Museum-quality prints.', 30],
            ['Modern Minimal', 'modern-minimal', 'Calm tonal compositions.', 40],
            ['Contemporary Icons', 'contemporary-icons', 'Statement makers.', 50],
            ['Gallery Editions', 'gallery-editions', 'Signature A7 ANAYARAA releases.', 60],
        ] as [$name, $slug, $desc, $sort]) {
            Category::query()->firstOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'description' => $desc, 'sort_order' => $sort, 'is_active' => true]
            );
        }

        Banner::query()->firstOrCreate(
            ['title' => 'Premium works, elegantly presented.'],
            [
                'subtitle' => 'Spring curation spotlight',
                'image_url' => 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1600&q=80',
                'link_url' => '/marketplace',
                'sort_order' => 10,
                'is_active' => true,
                'starts_at' => Carbon::now()->subMonth(),
                'ends_at' => Carbon::now()->addMonths(2),
            ]
        );

        Banner::query()->firstOrCreate(
            ['title' => 'Featured — Abstract Series'],
            [
                'subtitle' => 'Curated palettes for collector homes',
                'image_url' => 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1600&q=80',
                'link_url' => '/marketplace',
                'sort_order' => 20,
                'is_active' => true,
            ]
        );

        Banner::query()->firstOrCreate(
            ['title' => 'Sculpture room'],
            [
                'subtitle' => 'Tactile forms · limited placements',
                'image_url' => 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1600&q=80',
                'link_url' => '/contact',
                'sort_order' => 30,
                'is_active' => false,
            ]
        );

        if (Coupon::query()->doesntExist()) {
            Coupon::query()->insert([
                [
                    'code' => 'WELCOME15',
                    'description' => 'First acquisition · 15% off',
                    'discount_type' => Coupon::DISCOUNT_PERCENT,
                    'discount_value' => 15,
                    'minimum_order_amount' => 5000,
                    'max_redemptions' => 200,
                    'times_used' => 3,
                    'starts_at' => Carbon::now()->subDays(14),
                    'ends_at' => Carbon::now()->addDays(180),
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'code' => 'FLAT750',
                    'description' => 'Flat ₹750 off above ₹40k cart',
                    'discount_type' => Coupon::DISCOUNT_FIXED_INR,
                    'discount_value' => 750,
                    'minimum_order_amount' => 40000,
                    'max_redemptions' => null,
                    'times_used' => 1,
                    'starts_at' => null,
                    'ends_at' => null,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        if (Review::query()->doesntExist()) {
            Review::query()->insert([
                [
                    'product_name' => 'Heritage canvas — Dawn I',
                    'sku' => 'CV-DN-01',
                    'reviewer_name' => 'Isha Rao',
                    'reviewer_email' => 'isha.r@example.com',
                    'rating' => 5,
                    'body' => 'Framing exceeded expectations — concierge nailed the tonal brief.',
                    'status' => 'approved',
                    'created_at' => now()->subDays(5),
                    'updated_at' => now()->subDays(5),
                ],
                [
                    'product_name' => 'Oak frame — medium',
                    'sku' => 'FR-OK-M',
                    'reviewer_name' => 'Liam Patel',
                    'reviewer_email' => null,
                    'rating' => 4,
                    'body' => 'Beautiful craftsmanship; delivery window could be narrower.',
                    'status' => 'pending',
                    'created_at' => now()->subDay(),
                    'updated_at' => now()->subDay(),
                ],
                [
                    'product_name' => 'Ceramic sculpture — Wave',
                    'sku' => 'SC-WV-03',
                    'reviewer_name' => 'Anonymous collector',
                    'reviewer_email' => null,
                    'rating' => 2,
                    'body' => 'Packaging scuff — requesting touch-up polish.',
                    'status' => 'pending',
                    'created_at' => now()->subHours(6),
                    'updated_at' => now()->subHours(6),
                ],
                [
                    'product_name' => 'Canvas print — Midnight',
                    'sku' => 'CV-MN-09',
                    'reviewer_name' => 'Noah Gupta',
                    'reviewer_email' => 'noah.g@example.com',
                    'rating' => 5,
                    'body' => '',
                    'status' => 'rejected',
                    'created_at' => now()->subDays(20),
                    'updated_at' => now()->subDays(18),
                ],
            ]);
        }

        foreach ([
            'support_email' => 'concierge@a7anayaraa.gallery',
            'storefront_tagline' => 'Premium works, elegantly presented.',
            'gst_display_hint' => 'Inclusive of applicable duties where noted.',
            'carousel_interval_seconds' => '8',
        ] as $k => $v) {
            SiteSetting::query()->firstOrCreate(
                ['setting_key' => $k],
                ['setting_value' => $v]
            );
        }

        Order::query()
            ->select(['customer_email', 'customer_name', 'customer_phone'])
            ->whereNotNull('customer_email')
            ->orderByDesc('created_at')
            ->get()
            ->unique(fn ($o) => Str::lower($o->customer_email))
            ->each(function ($row): void {
                Customer::query()->firstOrCreate(
                    ['email' => $row->customer_email],
                    [
                        'name' => $row->customer_name,
                        'phone' => $row->customer_phone,
                    ]
                );
            });

        Customer::query()->firstOrCreate(
            ['email' => 'vip@collector.example'],
            ['name' => 'Saanvi Rao', 'phone' => '+91 98200 00000', 'admin_notes' => 'Prefer Saturday deliveries.']
        );
    }
}
