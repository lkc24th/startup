<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Register
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string|max:50|unique:users',
                'name' => 'nullable|string|max:100',
                'phone' => 'nullable|string|max:20|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'role' => 'required|in:admin'
            ]);

            if (($validated['role'] ?? null) !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Đăng ký chỉ dành cho tài khoản admin'
                ], 403);
            }

            $user = User::create([
                'username' => $validated['username'],
                'name' => $validated['name'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'password' => Hash::make($validated['password']),
                'role' => 'admin'
            ]);

            // Sync admin role with all admin permissions
            $user->syncRoles(['admin']);

            // Ensure the admin role has all its permissions
            $adminRole = \Spatie\Permission\Models\Role::where('name', 'admin')->first();
            if ($adminRole) {
                $user->syncPermissions($adminRole->permissions);
            }

            // Create Sanctum token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Create session-based auth for web guard requests
            Auth::login($user);
            $request->session()->regenerate();

            return response()->json([
                'success' => true,
                'message' => 'Đăng ký thành công',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi đăng ký',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Login - Accepts username only
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'username' => 'required|string',
                'password' => 'required|string'
            ]);

            // Find user by username
            $user = User::where('username', $validated['username'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Username hoặc mật khẩu không chính xác'
                ], 401);
            }

            if ($user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Đăng nhập chỉ dành cho tài khoản admin'
                ], 403);
            }

            $user->syncRoles(['admin']);

            // Ensure the admin role has all its permissions
            $adminRole = \Spatie\Permission\Models\Role::where('name', 'admin')->first();
            if ($adminRole) {
                $user->syncPermissions($adminRole->permissions);
            }

            // Create Sanctum token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Create session-based auth for web guard requests
            Auth::login($user);
            $request->session()->regenerate();

            return response()->json([
                'success' => true,
                'message' => 'Đăng nhập thành công',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi đăng nhập',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get current user
    public function user()
    {
        try {
            $user = Auth::user();

            if (!$user instanceof User) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chưa xác thực'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'roles' => $user->getRoleNames(),
                    'permissions' => $user->getPermissionNames(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi lấy thông tin người dùng',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Logout
    public function logout()
    {
        try {
            Auth::logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();

            return response()->json([
                'success' => true,
                'message' => 'Đăng xuất thành công'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi đăng xuất',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
