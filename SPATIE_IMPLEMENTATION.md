# 🔐 Spatie Permission Implementation Guide

## 📋 Overview

Spatie Laravel Permission được sử dụng để quản lý **Roles** (vai trò) và **Permissions** (quyền hạn) trong hệ thống Nail Salon Booking.

### Hiện tại có 2 Role chính:
- **admin** - Quản lý toàn bộ hệ thống
- **customer** - Khách hàng đặt lịch

---

## 🚀 Installation & Setup

### 1. Install Spatie Package

```bash
composer require spatie/laravel-permission
```

### 2. Publish Configuration

```bash
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

### 3. Run Migration

```bash
php artisan migrate
```

Điều này sẽ tạo các bảng:
- `permissions` - Lưu trữ các quyền
- `roles` - Lưu trữ các vai trò
- `model_has_permissions` - Gán quyền cho user
- `model_has_roles` - Gán vai trò cho user
- `role_has_permissions` - Gán quyền cho role

### 4. Seed Roles & Permissions

```bash
php artisan db:seed --class=PermissionSeeder
```

---

## 📊 Roles & Permissions

### Admin Role Permissions
```
✅ view_services
✅ create_services
✅ edit_services
✅ delete_services
✅ view_appointments
✅ view_all_appointments
✅ create_appointments
✅ edit_appointments
✅ confirm_appointments
✅ reject_appointments
✅ cancel_appointments
✅ reschedule_appointments
✅ change_appointment_status
✅ view_customers
✅ view_customer_details
✅ search_customers
✅ view_settings
✅ edit_settings
✅ manage_staff
```

### Customer Role Permissions
```
✅ view_services
✅ create_appointments
✅ view_appointments
✅ cancel_appointments
```

---

## 🔐 Usage Examples

### 1️⃣ Check User Role

```php
// In Controller
if (auth()->user()->hasRole('admin')) {
    // Admin operations
}

// In Blade
@role('admin')
    <!-- Admin content -->
@endrole
```

### 2️⃣ Check User Permission

```php
// In Controller
if (auth()->user()->hasPermissionTo('edit_services')) {
    // Allow edit services
}

// In Blade
@can('edit_services')
    <!-- Edit button -->
@endcan
```

### 3️⃣ Assign Role to User

```php
use App\Models\User;

$user = User::find(1);

// Assign single role
$user->assignRole('admin');

// Assign multiple roles
$user->assignRole('admin', 'customer');

// Or
$user->syncRoles(['admin', 'customer']);
```

### 4️⃣ Assign Permission to User

```php
// Direct permission to user
$user->givePermissionTo('edit_services');

// Or through role
$admin_role = \Spatie\Permission\Models\Role::findByName('admin');
$admin_role->givePermissionTo('edit_services');
```

### 5️⃣ Remove Role/Permission

```php
$user->removeRole('admin');
$user->revokePermissionTo('edit_services');
```

### 6️⃣ Check Multiple Permissions

```php
// Check if has ANY permission
if ($user->hasAnyPermission(['edit_services', 'delete_services'])) {
    // ...
}

// Check if has ALL permissions
if ($user->hasAllPermissions(['edit_services', 'delete_services'])) {
    // ...
}
```

---

## 🛣️ Route Middleware Usage

### Using Spatie Middleware in Routes

```php
// Check role
Route::middleware(['role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});

// Check permission
Route::middleware(['permission:edit_services'])->group(function () {
    Route::post('/services', [ServiceController::class, 'store']);
});

// Combined: role AND permission
Route::middleware(['role:admin', 'permission:edit_services'])->group(function () {
    Route::put('/services/{id}', [ServiceController::class, 'update']);
});

// Multiple roles (OR logic)
Route::middleware(['role:admin|customer'])->group(function () {
    Route::get('/appointments', [AppointmentController::class, 'index']);
});
```

### Current API Routes Setup

```php
// Admin Services Management
Route::middleware(['auth:sanctum', 'role:admin', 'permission:edit_services'])->group(function () {
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
});

// Customer Appointments
Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::get('/my-appointments', [AppointmentController::class, 'myAppointments']);
    Route::patch('/my-appointments/{id}/cancel', [AppointmentController::class, 'cancelMyAppointment']);
});
```

---

## 🎯 Practical Examples

### Example 1: Create New Admin User

```php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$admin = User::create([
    'name' => 'New Admin',
    'email' => 'newadmin@example.com',
    'password' => Hash::make('password'),
    'role' => 'admin'
]);

// Assign admin role
$admin->assignRole('admin');
```

### Example 2: Check Permission in Controller

```php
namespace App\Http\Controllers;

use App\Models\Service;

class ServiceController extends Controller
{
    public function update($id)
    {
        $user = auth()->user();

        // Check permission
        if (!$user->hasPermissionTo('edit_services')) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền chỉnh sửa dịch vụ'
            ], 403);
        }

        $service = Service::find($id);
        $service->update(request()->all());

        return response()->json([
            'success' => true,
            'message' => 'Dịch vụ được cập nhật',
            'data' => $service
        ]);
    }
}
```

### Example 3: Add New Permission to Role

```php
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

$admin_role = Role::findByName('admin');
$permission = Permission::firstOrCreate(['name' => 'export_reports']);

$admin_role->givePermissionTo($permission);
```

### Example 4: Get User Roles and Permissions (API Response)

```php
// In AuthController
public function user()
{
    $user = auth()->user();

    return response()->json([
        'success' => true,
        'data' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(),      // ['admin']
            'permissions' => $user->getPermissionNames(), // ['edit_services', ...]
        ]
    ]);
}

// Response:
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@nail-salon.com",
    "roles": ["admin"],
    "permissions": ["view_services", "create_services", "edit_services", ...]
  }
}
```

---

## 📱 Frontend Implementation (React)

### 1️⃣ Get User Permissions from API

```javascript
// src/context/AuthContext.js
const fetchUser = async () => {
  try {
    const response = await authAPI.getUser();
    if (response.data.success) {
      const userData = response.data.data;
      setUser({
        ...userData,
        roles: userData.roles || [],
        permissions: userData.permissions || []
      });
    }
  } catch (err) {
    // Handle error
  }
};
```

### 2️⃣ Check Permission in Components

```javascript
// src/components/AdminServices.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminServices = () => {
  const { user } = useContext(AuthContext);

  // Check if user has permission
  const canEditServices = user?.permissions?.includes('edit_services');
  const canDeleteServices = user?.permissions?.includes('delete_services');

  return (
    <div>
      {canEditServices && (
        <button>Edit Service</button>
      )}
      {canDeleteServices && (
        <button>Delete Service</button>
      )}
    </div>
  );
};

export default AdminServices;
```

### 3️⃣ Create Permission Guard Component

```javascript
// src/components/PermissionGuard.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { user } = useContext(AuthContext);

  if (!user?.permissions?.includes(permission)) {
    return fallback;
  }

  return children;
};

export default PermissionGuard;

// Usage:
<PermissionGuard permission="edit_services">
  <button>Edit Service</button>
</PermissionGuard>
```

### 4️⃣ Create Role Guard Component

```javascript
// src/components/RoleGuard.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RoleGuard = ({ role, children, fallback = null }) => {
  const { user } = useContext(AuthContext);

  if (!user?.roles?.includes(role)) {
    return fallback;
  }

  return children;
};

export default RoleGuard;

// Usage:
<RoleGuard role="admin">
  <AdminPanel />
</RoleGuard>
```

---

## 🔄 Managing Roles & Permissions in Artisan

### Create New Role

```bash
php artisan permission:create-role admin
php artisan permission:create-role customer
php artisan permission:create-role moderator
```

### Create New Permission

```bash
php artisan permission:create-permission export_reports
php artisan permission:create-permission delete_users
```

### Assign Permission to Role

```bash
php artisan permission:create-permission export_reports
# Then in code:
$role = Role::findByName('admin');
$role->givePermissionTo('export_reports');
```

---

## 🧪 Testing Permissions

### Test Middleware

```php
// tests/Feature/PermissionTest.php
use Tests\TestCase;
use App\Models\User;

class PermissionTest extends TestCase
{
    public function test_admin_can_create_service()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)->post('/api/services', [
            'name' => 'Test Service',
            'price' => 100000,
            'duration' => 60
        ]);

        $response->assertStatus(201);
    }

    public function test_customer_cannot_create_service()
    {
        $customer = User::factory()->create();
        $customer->assignRole('customer');

        $response = $this->actingAs($customer)->post('/api/services', [
            'name' => 'Test Service',
            'price' => 100000,
            'duration' => 60
        ]);

        $response->assertStatus(403);
    }
}
```

---

## 🔧 Advanced Configurations

### Custom Middleware for API

```php
// app/Http/Middleware/CheckApiPermission.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckApiPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        if ($request->user() && $request->user()->hasPermissionTo($permission)) {
            return $next($request);
        }

        return response()->json([
            'success' => false,
            'message' => 'Unauthorized - Missing permission: ' . $permission
        ], 403);
    }
}
```

### Register Custom Middleware

```php
// bootstrap/app.php
return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'check-permission' => \App\Http\Middleware\CheckApiPermission::class,
        ]);
    })
    // ...
```

---

## 📚 Useful Commands

```bash
# Clear cached permissions
php artisan permission:cache-reset

# Sync permissions from code
php artisan cache:clear

# List all roles
php artisan tinker
>>> Role::all();

# List all permissions
php artisan tinker
>>> Permission::all();
```

---

## ✅ Checklist

- [x] Spatie package installed
- [x] Migrations published and run
- [x] User model updated with HasRoles trait
- [x] Roles created (admin, customer)
- [x] Permissions created
- [x] Routes updated with middleware
- [x] Controllers updated
- [x] Frontend components updated
- [x] Seeders configured
- [x] API responses include permissions

---

## 🎯 Summary

Spatie Permission menyediakan sistem yang kuat dan fleksibel untuk:
- ✅ Mengelola roles dan permissions
- ✅ Mengendalikan akses berdasarkan permission
- ✅ Track yang mana user/role memiliki akses apa
- ✅ Mudah untuk extend dengan permission baru

**Sekarang sistem Nail Salon Booking memiliki kontrol akses yang ketat dan terstruktur! 🔐**
