<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminCouponController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max($request->integer('per_page', 40), 5), 200);
        $query = Coupon::query()->latest();

        if ($request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        return response()->json(
            $query->paginate($perPage)->through(fn (Coupon $c) => $this->transform($c))
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePayload($request, null);

        $coupon = Coupon::query()->create($validated);

        return response()->json(['data' => $this->transform($coupon)], 201);
    }

    public function update(Request $request, Coupon $coupon): JsonResponse
    {
        $coupon->fill($this->validatePayload($request, $coupon->id))->save();

        return response()->json(['data' => $this->transform($coupon->fresh()), 'message' => __('Saved.')]);
    }

    public function destroy(Coupon $coupon): JsonResponse
    {
        $coupon->delete();

        return response()->json(['message' => __('Coupon removed.')]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePayload(Request $request, ?int $couponId): array
    {
        $validated = $request->validate([
            'code' => [
                $couponId === null ? 'required' : 'sometimes',
                'string', 'max:40',
                Rule::unique('coupons', 'code')->ignore($couponId),
            ],
            'description' => ['nullable', 'string', 'max:240'],
            'discount_type' => [
                $couponId === null ? 'required' : 'sometimes',
                Rule::in([Coupon::DISCOUNT_PERCENT, Coupon::DISCOUNT_FIXED_INR]),
            ],
            'discount_value' => [$couponId === null ? 'required' : 'sometimes', 'numeric', 'min:0'],
            'minimum_order_amount' => ['nullable', 'numeric', 'min:0'],
            'max_redemptions' => ['nullable', 'integer', 'min:1'],
            'times_used' => ['sometimes', 'integer', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if (isset($validated['code'])) {
            $validated['code'] = strtoupper(trim((string) $validated['code']));
        }
        $validated['minimum_order_amount'] = $validated['minimum_order_amount'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;

        return $validated;
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(Coupon $c): array
    {
        return [
            'id' => $c->id,
            'code' => $c->code,
            'description' => $c->description,
            'discount_type' => $c->discount_type,
            'discount_value' => (float) $c->discount_value,
            'minimum_order_amount' => (float) $c->minimum_order_amount,
            'max_redemptions' => $c->max_redemptions,
            'times_used' => $c->times_used,
            'starts_at' => $c->starts_at?->toIso8601String(),
            'ends_at' => $c->ends_at?->toIso8601String(),
            'is_active' => $c->is_active,
            'updated_at' => $c->updated_at?->toIso8601String(),
        ];
    }
}
