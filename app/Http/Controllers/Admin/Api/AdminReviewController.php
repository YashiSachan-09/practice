<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min(max($request->integer('per_page', 30), 5), 100);
        $query = Review::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json(
            $query->paginate($perPage)->through(fn (Review $r) => $this->transform($r))
        );
    }

    public function update(Request $request, Review $review): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', Rule::in(Review::STATUSES)],
            'rating' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'body' => ['nullable', 'string', 'max:65000'],
        ]);

        $review->update($validated);

        return response()->json(['data' => $this->transform($review->fresh()), 'message' => __('Saved.')]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(Review $r): array
    {
        return [
            'id' => $r->id,
            'product_name' => $r->product_name,
            'sku' => $r->sku,
            'reviewer_name' => $r->reviewer_name,
            'reviewer_email' => $r->reviewer_email,
            'rating' => $r->rating,
            'body' => $r->body,
            'status' => $r->status,
            'created_at' => $r->created_at?->toIso8601String(),
            'updated_at' => $r->updated_at?->toIso8601String(),
        ];
    }
}
