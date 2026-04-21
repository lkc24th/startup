# 🚀 Spatie Permission - Quick Setup

## ⚡ Installation Steps (3 minutes)

### Step 1: Install Spatie Package

```bash
composer require spatie/laravel-permission
```

### Step 2: Publish Configuration

```bash
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

### Step 3: Run Migrations

```bash
# Fresh migration (if starting new)
php artisan migrate:fresh

# Or migrate existing database
php artisan migrate
```

### Step 4: Seed Roles & Permissions

```bash
php artisan db:seed --class=PermissionSeeder
```

**Done! ✅**

---

## 🔑 Demo Accounts

After seeding, you'll have:

| Email | Password | Role | Permissions |
|-------|----------|------|------------|
| admin@nail-salon.com | password | admin | All permissions |
| customer1@example.com | password | customer | Basic customer permissions |
| customer2@example.com | password | customer | Basic customer permissions |

---

## 📡 Test API with Spatie

### 1. Login as Admin

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nail-salon.com","password":"password"}'
```

Response will include:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "your-token-here"
  }
}
```

### 2. Get User Info (with Roles & Permissions)

```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer {token}" \
  -H "Accept: application/json"
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@nail-salon.com",
    "roles": ["admin"],
    "permissions": [
      "view_services",
      "create_services",
      "edit_services",
      ... (all other permissions)
    ]
  }
}
```

### 3. Test Permission - Create Service (Admin Only)

```bash
curl -X POST http://localhost:8000/api/services \
  -H "Authorization: Bearer {admin-token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Service",
    "description": "Test service",
    "price": 150000,
    "duration": 60
  }'
```

✅ **Success** if you have `edit_services` permission

### 4. Try with Customer Token (Should be Denied)

```bash
curl -X POST http://localhost:8000/api/services \
  -H "Authorization: Bearer {customer-token}" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

❌ **Response:**
```json
{
  "success": false,
  "message": "Chỉ admin mới có thể truy cập"
}
```

---

## 🧪 Verify Installation

### Check Database Tables

```bash
php artisan tinker
>>> \Spatie\Permission\Models\Role::all();
>>> \Spatie\Permission\Models\Permission::all();
>>> \App\Models\User::first()->getRoleNames();
```

### Check User Permissions in Tinker

```bash
php artisan tinker

>>> $admin = App\Models\User::where('email', 'admin@nail-salon.com')->first();
>>> $admin->getRoleNames();
=> Illuminate\Support\Collection {#4850
     all: [
       "admin",
     ],
   }

>>> $admin->getPermissionNames();
=> Illuminate\Support\Collection {#4851
     all: [
       "view_services",
       "create_services",
       "edit_services",
       "delete_services",
       ... (all permissions)
     ],
   }

>>> $admin->hasPermissionTo('edit_services');
=> true

>>> $admin->hasRole('admin');
=> true
```

---

## 🔐 Files Modified/Created

✅ **Models:**
- `app/Models/User.php` - Added `HasRoles` trait

✅ **Controllers:**
- `app/Http/Controllers/AuthController.php` - Updated register & user endpoints

✅ **Routes:**
- `routes/api.php` - Updated with Spatie middleware

✅ **Middleware:**
- `app/Http/Middleware/CheckPermission.php` - New
- `app/Http/Middleware/IsAdmin.php` - New
- `app/Http/Middleware/IsCustomer.php` - New

✅ **Database:**
- `database/migrations/2026_04_16_000000_create_permission_tables.php` - Spatie tables

✅ **Seeders:**
- `database/seeders/PermissionSeeder.php` - New (creates roles & permissions)
- `database/seeders/UsersSeeder.php` - Updated (assigns roles to users)
- `database/seeders/DatabaseSeeder.php` - Updated (calls PermissionSeeder)

✅ **Documentation:**
- `SPATIE_IMPLEMENTATION.md` - Complete guide

---

## 🛠️ Common Issues & Fixes

### Issue 1: "Table permissions doesn't exist"

**Solution:** Make sure migrations ran
```bash
php artisan migrate
```

### Issue 2: User doesn't have expected permissions

**Solution:** Reseed the database
```bash
php artisan db:seed --class=PermissionSeeder
```

### Issue 3: API returns 403 Unauthorized

**Check:**
1. Token is valid
2. User has the required role
3. Role has required permission

```bash
php artisan tinker
>>> $user = App\Models\User::find(1);
>>> $user->hasRole('admin');
>>> $user->hasPermissionTo('edit_services');
```

---

## 🔄 Update Routes After Adding New Permissions

When you add new permissions:

1. **Update PermissionSeeder:**
```php
$permissions = [
    // ... existing permissions
    'new_permission',  // Add here
];
```

2. **Run Seeder:**
```bash
php artisan db:seed --class=PermissionSeeder
```

3. **Update Routes (if needed):**
```php
Route::middleware(['permission:new_permission'])->group(function () {
    // Routes here
});
```

---

## 📚 Quick Reference

### Assign Role
```php
$user->assignRole('admin');
$user->syncRoles(['admin', 'customer']);
```

### Check Role
```php
$user->hasRole('admin');
if (auth()->user()->hasRole('admin')) { ... }
```

### Check Permission
```php
$user->hasPermissionTo('edit_services');
if (auth()->user()->hasPermissionTo('edit_services')) { ... }
```

### Get All Roles/Permissions
```php
$user->getRoleNames();
$user->getPermissionNames();
```

---

## 🚀 Next Steps

1. **Run Installation Steps Above** ⬆️
2. **Test API Endpoints** with provided curl commands
3. **Check User Roles** with Tinker
4. **Frontend Integration** - Use React components with permission checking
5. **Add New Permissions** - Update PermissionSeeder as needed

---

## 📞 After Setup Complete

✅ Admin can manage services, appointments, customers, settings  
✅ Customers can only book and view their appointments  
✅ API enforces permissions automatically  
✅ Frontend can check permissions before showing features  

**Your Nail Salon Booking System now has enterprise-grade permission management! 🔐✨**
