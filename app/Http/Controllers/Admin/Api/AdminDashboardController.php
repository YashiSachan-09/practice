<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    /** Maps seeded commerce SKUs to marketplace category slugs (see CatalogSeeder + OrderSeeder). */
    private const SKU_TO_CATEGORY_SLUG = [
        'CV-DN-01' => 'abstract-paintings',
        'CV-DN-02' => 'abstract-paintings',
        'CV-MN-09' => 'fine-art-prints',
        'LT-MN-14' => 'fine-art-prints',
        'FR-OK-M' => 'modern-minimal',
        'SC-WV-03' => 'sculpture',
        'PR-GS-22' => 'contemporary-icons',
    ];

    private const CATEGORY_PIE_HEX = [
        'abstract-paintings' => '#6366f1',
        'sculpture' => '#0891b2',
        'fine-art-prints' => '#ec4899',
        'modern-minimal' => '#f97316',
        'contemporary-icons' => '#a855f7',
        'gallery-editions' => '#eab308',
    ];

    public function summary(): JsonResponse
    {
        $days = 14;
        $start = Carbon::now()->subDays($days)->startOfDay();

        $statusCounts = Order::query()
            ->select('status', DB::raw('count(*) as aggregate'))
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $paidTotals = Order::query()
            ->where('payment_status', 'paid')
            ->whereNotIn('status', ['cancelled'])
            ->selectRaw('coalesce(sum(total),0) as revenue, count(*) as paid_orders')
            ->first()
            ?? (object) ['revenue' => 0, 'paid_orders' => 0];

        $recentOrders = Order::query()
            ->with('items')
            ->latest()
            ->take(8)
            ->get()
            ->map(fn (Order $o): array => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'customer_name' => $o->customer_name,
                'total' => $o->total,
                'status' => $o->status,
                'payment_status' => $o->payment_status,
                'created_at' => $o->created_at?->toIso8601String(),
            ]);

        $revenueTrend = Order::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('date(created_at) as d, coalesce(sum(total),0) as revenue, count(*) as orders')
            ->groupBy('d')
            ->orderBy('d')
            ->get()
            ->map(fn ($row): array => [
                'date' => $row->d,
                'revenue_inr' => (float) $row->revenue,
                'orders' => (int) $row->orders,
            ]);

        $topSkus = DB::table('order_items')
            ->select('sku', 'product_name', DB::raw('sum(quantity) as units'), DB::raw('coalesce(sum(line_total),0) as gmv'))
            ->whereNotNull('sku')
            ->where('sku', '!=', '')
            ->groupBy('sku', 'product_name')
            ->orderByDesc('gmv')
            ->limit(8)
            ->get();

        $gmvBySlug = [];
        foreach (OrderItem::query()->whereNotNull('sku')->cursor() as $item) {
            $sku = (string) $item->sku;
            $slug = self::SKU_TO_CATEGORY_SLUG[$sku] ?? 'gallery-editions';
            $gmvBySlug[$slug] = ($gmvBySlug[$slug] ?? 0) + (float) $item->line_total;
        }

        $categoryRows = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        $totalAssortmentGmv = array_sum($gmvBySlug) ?: 1e-9;

        $categoryShare = [];
        foreach ($categoryRows as $cat) {
            $gmv = (float) ($gmvBySlug[$cat->slug] ?? 0);
            if ($gmv <= 0) {
                continue;
            }
            $pct = round($gmv / $totalAssortmentGmv * 100, 1);
            $categoryShare[] = [
                'name' => $cat->name,
                'slug' => $cat->slug,
                'gmv_inr' => $gmv,
                'value' => $pct,
                'fill' => self::CATEGORY_PIE_HEX[$cat->slug] ?? '#94a3b8',
            ];
        }

        if ($categoryShare === []) {
            $categoryShare[] = [
                'name' => 'Awaiting line revenue',
                'slug' => 'placeholder',
                'gmv_inr' => 0,
                'value' => 100,
                'fill' => '#cbd5e1',
            ];
        }

        return response()->json([
            'counts' => [
                'orders_total' => Order::query()->count(),
                'orders_pending' => (int) ($statusCounts['pending'] ?? 0),
                'orders_confirmed' => (int) ($statusCounts['confirmed'] ?? 0),
                'orders_packed' => (int) ($statusCounts['packed'] ?? 0),
                'orders_shipped' => (int) ($statusCounts['shipped'] ?? 0),
                'orders_delivered' => (int) ($statusCounts['delivered'] ?? 0),
                'orders_cancelled' => (int) ($statusCounts['cancelled'] ?? 0),
            ],
            'revenue' => [
                'paid_orders' => (int) $paidTotals->paid_orders,
                'total_inr' => (float) $paidTotals->revenue,
            ],
            'recent_orders' => $recentOrders,
            'assortment' => [
                'revenue_trend_days' => $days,
                'revenue_trend' => $revenueTrend,
                'top_skus' => $topSkus->map(static fn ($row): array => [
                    'sku' => $row->sku,
                    'product_name' => $row->product_name,
                    'units' => (int) $row->units,
                    'gmv_inr' => (float) $row->gmv,
                ]),
                'category_share' => $categoryShare,
                'pulse' => [
                    'active_categories' => Category::query()->where('is_active', true)->count(),
                    'active_banners' => Banner::query()->where('is_active', true)->count(),
                    'pending_reviews' => Review::query()->where('status', 'pending')->count(),
                    'active_coupons' => Coupon::query()->where('is_active', true)->count(),
                ],
            ],
        ]);
    }
}
