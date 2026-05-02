<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminCustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max($request->integer('per_page', 25), 5), 100);

        $query = Customer::query()
            ->select('customers.*')
            ->selectRaw('(SELECT COUNT(*) FROM orders WHERE orders.customer_email = customers.email) as orders_count')
            ->selectRaw('(SELECT COALESCE(SUM(total), 0) FROM orders WHERE orders.customer_email = customers.email AND orders.status <> ? AND orders.payment_status = ?) as lifetime_inr', ['cancelled', 'paid'])
            ->selectRaw('(SELECT MAX(created_at) FROM orders WHERE orders.customer_email = customers.email) as last_order_at');

        if ($request->filled('q')) {
            $needle = '%'.$request->string('q')->trim()->toString().'%';
            $query->where(function ($q) use ($needle): void {
                $q->where('customers.email', 'like', $needle)
                    ->orWhere('customers.name', 'like', $needle)
                    ->orWhere('customers.phone', 'like', $needle);
            });
        }

        return response()->json(
            $query->orderByDesc('last_order_at')->orderBy('customers.email')->paginate($perPage)->through(function ($row): array {
                /** @var Customer $row */
                return [
                    'id' => $row->id,
                    'email' => $row->email,
                    'name' => $row->name,
                    'phone' => $row->phone,
                    'admin_notes' => $row->admin_notes,
                    'orders_count' => (int) $row->orders_count,
                    'lifetime_inr' => (float) $row->lifetime_inr,
                    'last_order_at' => $row->last_order_at ?? null,
                    'updated_at' => $row->updated_at?->toIso8601String(),
                ];
            })
        );
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:160'],
            'phone' => ['nullable', 'string', 'max:40'],
            'admin_notes' => ['nullable', 'string', 'max:65000'],
        ]);

        $customer->update($validated);

        return response()->json(['data' => $customer->fresh(), 'message' => __('Saved.')]);
    }
}
