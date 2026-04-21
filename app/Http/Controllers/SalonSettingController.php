<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SalonSettingController extends Controller
{
    private const CACHE_KEY = 'salon_settings';
    private const CACHE_DURATION = 86400; // 24 hours

    /**
     * Get public salon settings
     */
    public function publicSettings()
    {
        try {
            $cachedSettings = Cache::get(self::CACHE_KEY, []);

            $settings = array_merge([
                'salon_name' => config('salon.name', 'Nail Salon Pro'),
                'salon_address' => config('salon.address', ''),
                'salon_phone' => config('salon.phone', ''),
                'salon_email' => config('salon.email', ''),
                'working_hours' => config('salon.working_hours', []),
                'slot_duration' => config('salon.appointment.slot_duration', 30),
                'max_advance_days' => config('salon.appointment.max_advance_days', 30),
                'min_advance_hours' => config('salon.appointment.min_advance_hours', 1),
            ], $cachedSettings);

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin quán',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all settings (Admin only)
     */
    public function index()
    {
        try {
            $cachedSettings = Cache::get(self::CACHE_KEY, []);

            $settings = array_merge([
                'salon_name' => config('salon.name', 'Nail Salon Pro'),
                'salon_address' => config('salon.address', ''),
                'salon_phone' => config('salon.phone', ''),
                'salon_email' => config('salon.email', ''),
                'working_hours' => config('salon.working_hours', []),
                'slot_duration' => config('salon.appointment.slot_duration', 30),
                'max_concurrent_appointments' => config('salon.staff.max_concurrent_appointments', 1),
                'max_advance_days' => config('salon.appointment.max_advance_days', 30),
                'min_advance_hours' => config('salon.appointment.min_advance_hours', 1),
                'cancellation_hours' => config('salon.appointment.cancellation_hours', 24),
            ], $cachedSettings);

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy cài đặt',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update settings (Admin only)
     */
    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'salon_name' => 'nullable|string|max:255',
                'salon_address' => 'nullable|string',
                'salon_phone' => 'nullable|string|max:20',
                'salon_email' => 'nullable|email',
                'working_hours' => 'nullable|array',
                'slot_duration' => 'nullable|integer|min:5|max:120',
                'max_concurrent_appointments' => 'nullable|integer|min:1',
                'max_advance_days' => 'nullable|integer|min:1|max:365',
                'min_advance_hours' => 'nullable|integer|min:0',
                'cancellation_hours' => 'nullable|integer|min:0|max:168'
            ]);

            // Filter out null values
            $updateData = array_filter($validated, fn ($value) => $value !== null);

            if (!empty($updateData)) {
                // Store in cache for runtime changes
                $cachedSettings = Cache::get(self::CACHE_KEY, []);
                $cachedSettings = array_merge($cachedSettings, $updateData);
                Cache::put(self::CACHE_KEY, $cachedSettings, self::CACHE_DURATION);
            }

            return response()->json([
                'success' => true,
                'message' => 'Cài đặt được cập nhật thành công',
                'data' => $updateData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi cập nhật cài đặt',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
