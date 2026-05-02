<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Review;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminReportController extends Controller
{
    public function summary(Request $request): JsonResponse
    {
        $days = min(max($request->integer('trend_days', 14), 7), 90);
        $start = Carbon::now()->subDays($days)->startOfDay();

        $ordersLastWindow = Order::query()
            ->where('created_at', '>=', $start)
            ->selectRaw('date(created_at) as d, count(*) as c, coalesce(sum(total),0) as revenue')
            ->groupBy('d')
            ->orderBy('d')
            ->get();

        $statusMix = Order::query()
            ->select('status', DB::raw('count(*) as aggregate'))
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $topSkus = DB::table('order_items')
            ->select('sku', 'product_name', DB::raw('sum(quantity) as units'), DB::raw('coalesce(sum(line_total),0) as gmv'))
            ->whereNotNull('sku')
            ->groupBy('sku', 'product_name')
            ->orderByDesc('gmv')
            ->limit(8)
            ->get();

        return response()->json([
            'window_days' => $days,
            'orders_trend' => $ordersLastWindow->map(fn ($row) => [
                'date' => $row->d,
                'orders' => (int) $row->c,
                'revenue_inr' => (float) $row->revenue,
            ]),
            'orders_by_status' => $statusMix,
            'top_skus' => $topSkus,
            'counts' => [
                'active_coupons' => Coupon::query()->where('is_active', true)->count(),
                'pending_reviews' => Review::query()->where('status', 'pending')->count(),
            ],
        ]);
    }

    public function ordersCsv(): StreamedResponse
    {
        $filename = 'a7-anayaraa-orders-'.Carbon::now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function (): void {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['order_number', 'customer_name', 'customer_email', 'status', 'payment_status', 'total', 'created_at']);

            Order::query()
                ->orderByDesc('id')
                ->chunk(200, function ($chunk) use ($out): void {
                    foreach ($chunk as $order) {
                        /** @var Order $order */
                        fputcsv($out, [
                            $order->order_number,
                            $order->customer_name,
                            $order->customer_email,
                            $order->status,
                            $order->payment_status,
                            $order->total,
                            $order->created_at?->toIso8601String(),
                        ]);
                    }
                });

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
