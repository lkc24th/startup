<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Appointment;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    // Get all customers (Admin)
    public function index(Request $request)
    {
        try {
            $query = User::where('role', 'customer')->orWhereNull('role');

            // Pagination
            $perPage = $request->get('per_page', 15);
            $customers = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $customers->items(),
                'pagination' => [
                    'total' => $customers->total(),
                    'per_page' => $customers->perPage(),
                    'current_page' => $customers->currentPage(),
                    'last_page' => $customers->lastPage()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy danh sách khách hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get single customer (Admin)
    public function show($id)
    {
        try {
            $customer = User::findOrFail($id);
            $appointments = Appointment::where('user_id', $id)
                ->with(['staff', 'services'])
                ->orderBy('appointment_date', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'customer' => $customer,
                    'appointments' => $appointments,
                    'total_appointments' => count($appointments),
                    'total_spent' => $appointments->sum('total_price')
                ]
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Khách hàng không tìm thấy'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin khách hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Search customers (Admin)
    public function search($query)
    {
        try {
            $query = trim($query);

            if (strlen($query) < 2) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tìm kiếm phải chứa ít nhất 2 ký tự'
                ], 400);
            }

            $customers = User::where(function ($q) use ($query) {
                $q->where('name', 'like', "%$query%")
                  ->orWhere('phone', 'like', "%$query%")
                  ->orWhere('email', 'like', "%$query%");
            })
            ->where(function ($q) {
                $q->where('role', 'customer')->orWhereNull('role');
            })
            ->limit(20)
            ->get();

            return response()->json([
                'success' => true,
                'data' => $customers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi tìm kiếm khách hàng',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
