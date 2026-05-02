<?php

namespace App\Http\Controllers\Admin\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminSettingController extends Controller
{
    public function show(): JsonResponse
    {
        $map = SiteSetting::query()->pluck('setting_value', 'setting_key')->all();

        return response()->json(['data' => $map]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable', 'string', 'max:65000'],
        ]);

        foreach ($validated['settings'] as $key => $value) {
            $k = Str::substr((string) $key, 0, 120);
            if ($k === '') {
                continue;
            }
            SiteSetting::query()->updateOrCreate(
                ['setting_key' => $k],
                ['setting_value' => $value]
            );
        }

        return response()->json([
            'data' => SiteSetting::query()->pluck('setting_value', 'setting_key')->all(),
            'message' => __('Settings saved.'),
        ]);
    }
}
