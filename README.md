# 🏠 Dormitory Management System

Chào mừng đến với **Dormitory Management System** - Hệ thống quản lý ký túc xá, được xây dựng trên nền tảng **Laravel (Backend)** và **ReactJS (Frontend)**.

---

## 📚 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Quy tắc làm việc](#quy-tắc-làm-việc)
- [Hướng dẫn Pull Request (PR)](#hướng-dẫn-pull-request-pr)
- [Liên hệ](#liên-hệ)

---

## 🎯 Giới thiệu

Hệ thống quản lý ký túc xá với các chức năng chính:
- **Xác thực & Phân quyền** (JWT - Laravel Sanctum)
- **Quản lý phòng** (CRUD phòng, cập nhật trạng thái)
- **Quản lý sinh viên** (Danh sách, hợp đồng thuê)
- **Thanh toán** (Hóa đơn, trạng thái thanh toán)
- **Quản lý thông báo** (Gửi & nhận thông báo)
- **Bảng điều khiển** (Dashboard tổng quan)
- **Quản trị viên** (Quản lý người dùng, phân quyền)

**Công nghệ sử dụng:**
- **Backend**: Laravel + MySQL
- **Frontend**: ReactJS (React Router, Bootstrap)
- **Auth**: JWT (Laravel Sanctum)
- **Database**: MySQL

---

## 📁 Cấu trúc dự án

```
dormitory-management/
├── backend/                  # Code backend Laravel
│   ├── app/                  # Controllers, Models, Middleware, Services
│   ├── config/               # Cấu hình Laravel
│   ├── database/             # Migrations, Seeds
│   ├── routes/               # API routes
│   ├── public/               # File tĩnh
│   ├── storage/              # Log, cache, uploads
│   ├── .env                  # Biến môi trường
│   └── composer.json         # Packages PHP
│
├── frontend/                 # Code frontend ReactJS
│   ├── src/                  # Mã nguồn chính
│   │   ├── components/       # Các component tái sử dụng
│   │   ├── pages/            # Các trang chính
│   │   ├── services/         # API services (axios)
│   │   ├── context/          # Auth & Role Context
│   │   ├── App.js            # Cấu hình routes
│   │   ├── index.js          # Khởi chạy app
│   │   ├── styles/           # File CSS, SCSS
│   │   ├── utils/            # Các helper function
│   ├── public/               # File tĩnh
│   ├── .env                  # Biến môi trường frontend
│   ├── package.json          # Packages ReactJS
│   └── README.md             # Hướng dẫn frontend
│
├── docs/                     # Tài liệu dự án
├── .gitignore                # Ignore files khi commit
└── README.md                 # Hướng dẫn chung dự án
```

---

## ⚙️ Hướng dẫn cài đặt

### 1️⃣ Clone project:
```bash
git clone https://github.com/khaitrandinh/dormitory-management.git
cd dormitory-management
```

### 2️⃣ Cài đặt Backend:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 3️⃣ Cài đặt Frontend:
```bash
cd ../frontend
npm install
cp .env.example .env
npm start
```

> 🚀 **Backend chạy tại:** http://127.0.0.1:8000  
> 🌍 **Frontend chạy tại:** http://localhost:3000  

---

## 🚨 Quy tắc làm việc

> **❌ Không commit trực tiếp vào nhánh `main`!**  
> **✅ Luôn làm việc trên branch riêng, gửi Pull Request trước khi merge.**

### 1️⃣ Quy trình chuẩn:
1. **Tạo branch mới** theo task đang làm:
   ```bash
   git checkout -b feature/login-page
   ```
2. **Viết code & commit theo chuẩn**:
   ```bash
   git commit -m "feat: Thêm màn hình đăng nhập"
   ```
3. **Đẩy branch lên GitHub & tạo PR**:
   ```bash
   git push origin feature/login-page
   ```
4. **Chờ review & merge vào `main`.**

---

## 🔀 Hướng dẫn Pull Request (PR)

- **Title PR rõ ràng**, ví dụ:
  - ✅ `[FEATURE] Thêm chức năng đăng ký sinh viên`
  - ❌ `Thêm đăng ký`
- **Gán người review.**
- **Chỉ merge khi có ít nhất 1 approve.**

---

## 🤝 Liên hệ

- **Owner**: [Khai Tran Dinh](https://github.com/khaitrandinh)
- Email: khaidinhtran0312@gmail.com
- **Dev**: [Tran Sy Chuong](https://github.com/TranSenpai)
- Email: chuongtran975@gmail.com
- **Dev**: [Nguyen Huu Thang](https://github.com/nguyenhuuthang113)
- Email: HuuThang030603@gmail.com

---

## 🚀 Góp ý và phát triển

> **Mọi commit & PR phải đảm bảo an toàn, đã qua review.**  
> **Liên hệ trực tiếp nếu cần hỗ trợ!** 🚀

