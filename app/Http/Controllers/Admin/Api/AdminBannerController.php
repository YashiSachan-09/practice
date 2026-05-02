<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminBannerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Banner::query()->orderBy('sort_order')->orderByDesc('id');

        if ($request->boolean('active_only')) {
            $query->where('is_active', true);
        }

        return response()->json(['data' => $query->get()->map(fn (Banner $b) => $this->transform($b))]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePayload($request, true);
        $banner = Banner::query()->create($validated);

        return response()->json(['data' => $this->transform($banner)], 201);
    }

    public function update(Request $request, Banner $banner): JsonResponse
    {
        $validated = $this->validatePayload($request, false);
        $banner->fill($validated)->save();

        return response()->json(['data' => $this->transform($banner->fresh()), 'message' => __('Saved.')]);
    }

    public function destroy(Banner $banner): JsonResponse
    {
        $banner->delete();

        return response()->json(['message' => __('Banner removed.')]);
    }

    /**
     * @return array<string, mixed>
     */
    private function validatePayload(Request $request, bool $isCreate): array
    {
        if ($isCreate) {
            return $request->validate([
                'title' => ['required', 'string', 'max:160'],
                'subtitle' => ['nullable', 'string', 'max:220'],
                'image_url' => ['required', 'string', 'max:2048'],
                'link_url' => ['nullable', 'string', 'max:2048'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
                'is_active' => ['sometimes', 'boolean'],
                'starts_at' => ['nullable', 'date'],
                'ends_at' => ['nullable', 'date'],
            ]);
        }

        return $request->validate([
            'title' => ['sometimes', 'string', 'max:160'],
            'subtitle' => ['nullable', 'string', 'max:220'],
            'image_url' => ['sometimes', 'string', 'max:2048'],
            'link_url' => ['nullable', 'string', 'max:2048'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transform(Banner $b): array
    {
        return [
            'id' => $b->id,
            'title' => $b->title,
            'subtitle' => $b->subtitle,
            'image_url' => $b->image_url,
            'link_url' => $b->link_url,
            'sort_order' => $b->sort_order,
            'is_active' => $b->is_active,
            'starts_at' => $b->starts_at?->toIso8601String(),
            'ends_at' => $b->ends_at?->toIso8601String(),
            'updated_at' => $b->updated_at?->toIso8601String(),
        ];
    }
}
