# 🚀 Quick Start Guide - Nail Salon Booking System

Hướng dẫn nhanh để chạy hệ thống đặt lịch salon.

## ⚡ 5 Phút Setup

### 1️⃣ Backend Setup (Laravel)

```bash
# Bước 1: Đến thư mục project
cd d:/LARAVEL/nail/nail-booking-system

# Bước 2: Cài đặt dependencies
composer install

# Bước 3: Setup environment
cp .env.example .env

# Bước 4: Generate APP_KEY
php artisan key:generate

# Bước 5: Chạy migration & seeder
php artisan migrate --seed

# Bước 6: Start Laravel server
php artisan serve
# Server sẽ chạy ở http://localhost:8000
```

### 2️⃣ Frontend Setup (React)

```bash
# Bước 1: Vào thư mục React
cd resources/react

# Bước 2: Cài dependencies
npm install

# Bước 3: Setup environment
copy .env.example .env

# Bước 4: Start React dev server
npm start
# App sẽ mở ở http://localhost:3000
```

## 🎯 Đăng Nhập

Mở http://localhost:3000 và đăng nhập bằng:

**Admin Account:**
```
Email: admin@nail-salon.com
Password: password
```

**Customer:**
- Không cần đăng nhập
- Chỉ cần nhập SĐT để tra cứu lịch

## 📱 Giao Diện

### 👤 Khách Hàng
1. **🏠 Trang Chủ** - Xem dịch vụ & thông tin quán
2. **📅 Đặt Lịch** - Chọn dịch vụ & đặt lịch mới
3. **🔍 Tra Cứu** - Tìm lịch hẹn theo SĐT

### 🔧 Admin
1. **📊 Lịch Hẹn** - Quản lý tất cả lịch hẹn
2. **💅 Dịch Vụ** - Thêm/sửa/xóa dịch vụ
3. **👥 Khách Hàng** - Xem danh sách & chi tiết khách
4. **⚙️ Cài Đặt** - Cấu hình quán (giờ làm, ngày nghỉ...)

## 📊 Dữ Liệu Demo

Hệ thống sẽ tạo sẵn:
- 5 dịch vụ demo (Nail Gel, Sơn móng, v.v...)
- 3 nhân viên demo (Thương, Hương, Linh)
- 1 admin account

## 🔗 URLs Quan Trọng

```
Backend:     http://localhost:8000
Frontend:    http://localhost:3000
API:         http://localhost:8000/api
```

## 🐛 Troubleshooting

### Laravel không chạy?
```bash
# Kiểm tra PHP version
php --version  # Phải >= 8.2

# Xóa cache
php artisan cache:clear
php artisan config:clear

# Chạy lại migration
php artisan migrate:fresh --seed
```

### React không kết nối API?
```bash
# Kiểm tra file .env
cat resources/react/.env

# Đảm bảo REACT_APP_API_URL=http://localhost:8000/api

# Xóa cache browser (Ctrl+Shift+Delete)
# Hoặc chạy lại npm start
```

### Port 8000 hoặc 3000 đã có sử dụng?
```bash
# Kiểm tra port 8000
netstat -ano | findstr :8000

# Chạy Laravel ở port khác
php artisan serve --port=8001

# Chạy React ở port khác
PORT=3001 npm start
```

## 📝 API Testing

### Kiểm tra API bằng curl:

```bash
# Đăng nhập
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nail-salon.com","password":"password"}'

# Lấy danh sách dịch vụ
curl http://localhost:8000/api/services

# Tạo lịch hẹn mới
curl -X POST http://localhost:8000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "phone":"0123456789",
    "appointment_date":"2026-04-20 14:00",
    "staff_id":1,
    "services":[1,2],
    "notes":"Sample nails"
  }'
```

## 🔐 Passwords

Tất cả demo accounts sử dụng: `password`

## 📂 Quan Trọng

```
✅ Luôn commit code thường xuyên
✅ Không commit node_modules/ và vendor/
✅ Tạo .env.local cho settings local
✅ Backup database thường xuyên (php artisan db:seed)
```

## 🎓 Học Thêm

- [Laravel Docs](https://laravel.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

## 💬 Cần Giúp?

```bash
# Xem log Laravel
tail -f storage/logs/laravel.log

# Xem console React (F12 trong Browser)
```

---

**Vậy là xong! 🎉 Bây giờ bạn có thể:**
- ✅ Xem dịch vụ
- ✅ Đặt lịch hẹn
- ✅ Tra cứu lịch
- ✅ Quản lý từ admin panel

Chúc bạn code vui vẻ! 💅✨
