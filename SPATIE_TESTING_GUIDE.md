# 🧪 Spatie Permission Testing Guide

## 📊 Test Scenarios

### Scenario 1: Admin User Full Access

Admin should have access to ALL operations.

#### 1.1 Login as Admin
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nail-salon.com",
    "password": "password"
  }'
```

**Expected Response:** ✅ 200 OK
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@nail-salon.com",
      "role": "admin"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### 1.2 Get Admin User Info (with Permissions)
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer eyJ0eXAiOi..." \
  -H "Accept: application/json"
```

**Expected Response:** ✅ 200 OK
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@nail-salon.com",
    "phone": "0123456789",
    "role": "admin",
    "roles": ["admin"],
    "permissions": [
      "view_services",
      "create_services",
      "edit_services",
      "delete_services",
      "view_appointments",
      "view_all_appointments",
      "create_appointments",
      "edit_appointments",
      "confirm_appointments",
      "reject_appointments",
      "cancel_appointments",
      "reschedule_appointments",
      "change_appointment_status",
      "view_customers",
      "view_customer_details",
      "search_customers",
      "view_settings",
      "edit_settings",
      "manage_staff"
    ]
  }
}
```

#### 1.3 Create Service (Admin)
```bash
curl -X POST http://localhost:8000/api/services \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Nail Art",
    "description": "Professional nail art design",
    "price": 250000,
    "duration": 90,
    "is_active": true
  }'
```

**Expected Response:** ✅ 201 Created
```json
{
  "success": true,
  "message": "Dịch vụ được tạo thành công",
  "data": {
    "id": 6,
    "name": "Premium Nail Art",
    "description": "Professional nail art design",
    "price": 250000,
    "duration": 90,
    "is_active": true
  }
}
```

#### 1.4 Update Service (Admin)
```bash
curl -X PUT http://localhost:8000/api/services/6 \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 270000,
    "is_active": false
  }'
```

**Expected Response:** ✅ 200 OK

#### 1.5 Delete Service (Admin)
```bash
curl -X DELETE http://localhost:8000/api/services/6 \
  -H "Authorization: Bearer admin_token"
```

**Expected Response:** ✅ 200 OK
```json
{
  "success": true,
  "message": "Dịch vụ được xóa thành công"
}
```

#### 1.6 View All Appointments (Admin)
```bash
curl -X GET "http://localhost:8000/api/appointments?start_date=2026-04-01&end_date=2026-04-30" \
  -H "Authorization: Bearer admin_token"
```

**Expected Response:** ✅ 200 OK with all appointments

#### 1.7 Confirm Appointment (Admin)
```bash
curl -X PATCH http://localhost:8000/api/appointments/1/confirm \
  -H "Authorization: Bearer admin_token"
```

**Expected Response:** ✅ 200 OK

#### 1.8 View All Customers (Admin)
```bash
curl -X GET http://localhost:8000/api/customers \
  -H "Authorization: Bearer admin_token"
```

**Expected Response:** ✅ 200 OK with customer list

#### 1.9 Update Salon Settings (Admin)
```bash
curl -X PUT http://localhost:8000/api/salon-settings \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json" \
  -d '{
    "salon_name": "Nail Palace",
    "slot_duration": 45,
    "max_concurrent_staff": 8
  }'
```

**Expected Response:** ✅ 200 OK

---

### Scenario 2: Customer User Limited Access

Customer should ONLY have access to specific operations.

#### 2.1 Login as Customer
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer1@example.com",
    "password": "password"
  }'
```

**Expected Response:** ✅ 200 OK

#### 2.2 Get Customer User Info
```bash
curl -X GET http://localhost:8000/api/user \
  -H "Authorization: Bearer customer_token"
```

**Expected Response:** ✅ 200 OK
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Nguyễn Văn A",
    "email": "customer1@example.com",
    "phone": "0987654321",
    "role": "customer",
    "roles": ["customer"],
    "permissions": [
      "view_services",
      "create_appointments",
      "view_appointments",
      "cancel_appointments"
    ]
  }
}
```

#### 2.3 View Services (Customer) ✅ ALLOWED
```bash
curl -X GET http://localhost:8000/api/services \
  -H "Authorization: Bearer customer_token"
```

**Expected Response:** ✅ 200 OK

#### 2.4 Book Appointment (Customer) ✅ ALLOWED
```bash
curl -X POST http://localhost:8000/api/appointments \
  -H "Authorization: Bearer customer_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "phone": "0987654321",
    "appointment_date": "2026-04-20 14:00:00",
    "staff_id": 1,
    "services": [1, 2],
    "notes": "Mẫu nail đẹp"
  }'
```

**Expected Response:** ✅ 201 Created

#### 2.5 View Own Appointments (Customer) ✅ ALLOWED
```bash
curl -X GET http://localhost:8000/api/my-appointments \
  -H "Authorization: Bearer customer_token"
```

**Expected Response:** ✅ 200 OK

#### 2.6 Create Service (Customer) ❌ FORBIDDEN
```bash
curl -X POST http://localhost:8000/api/services \
  -H "Authorization: Bearer customer_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Service",
    "price": 100000,
    "duration": 60
  }'
```

**Expected Response:** ❌ 403 Forbidden
```json
{
  "success": false,
  "message": "Chỉ admin mới có thể truy cập"
}
```

#### 2.7 Delete Service (Customer) ❌ FORBIDDEN
```bash
curl -X DELETE http://localhost:8000/api/services/1 \
  -H "Authorization: Bearer customer_token"
```

**Expected Response:** ❌ 403 Forbidden

#### 2.8 View All Appointments (Customer) ❌ FORBIDDEN
```bash
curl -X GET http://localhost:8000/api/appointments \
  -H "Authorization: Bearer customer_token"
```

**Expected Response:** ❌ 403 Forbidden
```json
{
  "success": false,
  "message": "Chỉ admin mới có thể truy cập"
}
```

#### 2.9 View All Customers (Customer) ❌ FORBIDDEN
```bash
curl -X GET http://localhost:8000/api/customers \
  -H "Authorization: Bearer customer_token"
```

**Expected Response:** ❌ 403 Forbidden

#### 2.10 Update Settings (Customer) ❌ FORBIDDEN
```bash
curl -X PUT http://localhost:8000/api/salon-settings \
  -H "Authorization: Bearer customer_token" \
  -H "Content-Type: application/json" \
  -d '{
    "salon_name": "Test"
  }'
```

**Expected Response:** ❌ 403 Forbidden

---

### Scenario 3: Unauthenticated User

No token provided.

#### 3.1 Try to Access Protected Route Without Token
```bash
curl -X GET http://localhost:8000/api/my-appointments
```

**Expected Response:** ❌ 401 Unauthorized

#### 3.2 Public Routes Should Work (No Token Needed)
```bash
# View services (public)
curl -X GET http://localhost:8000/api/services

# Book appointment (public)
curl -X POST http://localhost:8000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Walk-in Customer",
    "phone": "0999999999",
    "appointment_date": "2026-04-20 14:00:00",
    "staff_id": 1,
    "services": [1]
  }'

# Lookup appointment by phone (public)
curl -X GET http://localhost:8000/api/appointments/phone/0999999999

# Get salon settings (public)
curl -X GET http://localhost:8000/api/salon-settings
```

**Expected Response:** ✅ 200 OK (all work without token)

---

## 🔍 Permission Check Matrix

| Operation | Admin | Customer | Public |
|-----------|:-----:|:--------:|:------:|
| View Services | ✅ | ✅ | ✅ |
| Create Service | ✅ | ❌ | ❌ |
| Edit Service | ✅ | ❌ | ❌ |
| Delete Service | ✅ | ❌ | ❌ |
| View All Appointments | ✅ | ❌ | ❌ |
| Book Appointment | ✅ | ✅ | ✅ |
| View Own Appointments | ✅ | ✅ | ❌ |
| Confirm Appointment | ✅ | ❌ | ❌ |
| Reject Appointment | ✅ | ❌ | ❌ |
| Cancel Appointment | ✅ | ✅ | ❌ |
| View Customers | ✅ | ❌ | ❌ |
| View Settings | ✅ | ❌ | ❌ |
| Edit Settings | ✅ | ❌ | ❌ |
| Lookup Appointment by Phone | ✅ | ✅ | ✅ |

---

## 🚀 Test with Postman

### 1. Create Collection
- New Collection: "Nail Salon API"

### 2. Create Environment
Variables:
- `base_url` = `http://localhost:8000/api`
- `admin_token` = (empty, fill after login)
- `customer_token` = (empty, fill after login)

### 3. Add Requests

**Login Admin:**
```
POST {{base_url}}/login
Body (JSON):
{
  "email": "admin@nail-salon.com",
  "password": "password"
}

Tests (Script):
var jsonData = pm.response.json();
pm.environment.set("admin_token", jsonData.data.token);
```

**Login Customer:**
```
POST {{base_url}}/login
Body (JSON):
{
  "email": "customer1@example.com",
  "password": "password"
}

Tests (Script):
var jsonData = pm.response.json();
pm.environment.set("customer_token", jsonData.data.token);
```

**Create Service (Admin):**
```
POST {{base_url}}/services
Headers:
Authorization: Bearer {{admin_token}}

Body (JSON):
{
  "name": "Test Service",
  "price": 150000,
  "duration": 60
}
```

**Create Service (Customer - Should Fail):**
```
POST {{base_url}}/services
Headers:
Authorization: Bearer {{customer_token}}

Body (JSON):
{
  "name": "Test Service",
  "price": 150000,
  "duration": 60
}

Tests (Assertion):
pm.test("Should return 403", function () {
    pm.response.to.have.status(403);
});
```

---

## 📋 Test Checklist

### Admin Permissions ✅
- [ ] Can create services
- [ ] Can edit services
- [ ] Can delete services
- [ ] Can view all appointments
- [ ] Can confirm appointments
- [ ] Can reject appointments
- [ ] Can reschedule appointments
- [ ] Can view all customers
- [ ] Can search customers
- [ ] Can edit settings

### Customer Permissions ✅
- [ ] Can view services
- [ ] Can book appointments
- [ ] Can view own appointments
- [ ] Can cancel own appointments
- [ ] Cannot create services
- [ ] Cannot edit services
- [ ] Cannot view all appointments
- [ ] Cannot view customers
- [ ] Cannot edit settings

### Public Access ✅
- [ ] Can view services without login
- [ ] Can book without login
- [ ] Can lookup appointment by phone
- [ ] Can view salon settings

### Protection ✅
- [ ] Protected routes require token
- [ ] Invalid token rejected
- [ ] Expired token rejected
- [ ] User without permission gets 403

---

## 📊 Response Codes Expected

| HTTP Code | Meaning | Example |
|-----------|---------|---------|
| 200 | Success | Service created |
| 201 | Created | New resource |
| 400 | Bad Request | Invalid data |
| 401 | Unauthorized | Missing token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 422 | Validation Error | Invalid input |
| 500 | Server Error | Internal error |

---

## 🎯 Final Verification

When all tests pass:
- ✅ Spatie permissions working correctly
- ✅ Admin has full access
- ✅ Customer has limited access
- ✅ API enforces permissions
- ✅ Unauthorized access blocked

**Your permission system is production-ready! 🚀**
