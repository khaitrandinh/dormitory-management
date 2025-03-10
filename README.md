# 🏠 Dormitory Management System

Chào mừng đến với **Dormitory Management System** - Hệ thống quản lý ký túc xá được phát triển với kiến trúc microservices.

---

## 📚 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Cấu trúc repo](#cấu-trúc-repo)
- [Quy tắc làm việc](#quy-tắc-làm-việc)
- [Hướng dẫn pull request (PR)](#hướng-dẫn-pull-request-pr)
- [Thiết lập môi trường](#thiết-lập-môi-trường)
- [Liên hệ](#liên-hệ)

---

## 🌟 Giới thiệu

Repo này là hệ thống quản lý ký túc xá được phát triển theo mô hình **Microservices**, bao gồm nhiều service riêng biệt: 
- **Auth Service** (Đăng nhập, đăng ký, phân quyền)
- **Room Service** (Quản lý phòng)
- **Payment Service** (Thanh toán)
- **Notification Service** (Thông báo)
- **API Gateway**
- **Frontend** (React App)

---

## 📁 Cấu trúc repo

```
dormitory-management/
├── api-gateway/             # API Gateway cho toàn hệ thống
├── frontend/                # Giao diện người dùng
│   ├── node_modules/              # Thư viện, package cài qua npm (tự động tạo khi chạy npm install)
│   ├── public/                   # Chứa các file tĩnh (static) như index.html, icon, manifest
│   ├── src/                      # Chứa toàn bộ source code của frontend
│   │   ├── Components/           # Các component dùng chung (ví dụ: Button, Header, Footer, Modal, v.v.)
│   │   ├── Pages/                # Các page, mỗi page là 1 màn hình chính (ví dụ: Home, Login, Dashboard)
│   │   ├── App.css              # File CSS chính cho App component
│   │   ├── App.js               # File khởi tạo App chính, quản lý router, layout
│   │   ├── index.css            # File CSS toàn cục cho toàn bộ app
│   │   ├── index.js             # Điểm khởi tạo ứng dụng React, render App vào DOM
│   ├── .gitignore               # Các file/thư mục bị git bỏ qua (ví dụ: node_modules, .env)
│   ├── Dockerfile              # Cấu hình Docker để build image frontend
│   ├── package-lock.json       # File quản lý version cụ thể của các package đã cài (tự tạo khi npm install)
│   ├── package.json            # Khai báo các package, script, metadata của dự án
│   └── README.md               # Tài liệu hướng dẫn riêng cho Frontend
├── services/
│   ├── auth-service/        # Xác thực và phân quyền
│   ├── room-service/        # Quản lý phòng
│   ├── payment-service/     # Quản lý thanh toán
│   ├── notification-service/ # Quản lý thông báo
│   └── student-service/     # Quản lý sinh viên (đang phát triển)
└── README.md                # File hướng dẫn
```

---

## 🚨 Quy tắc làm việc

> **Lưu ý quan trọng: Không commit trực tiếp vào nhánh `main`!**

### ✅ Quy trình làm việc chuẩn:

1. **Fork hoặc clone repo về máy**.
2. **Tạo branch mới** cho mỗi task/feature/bug fix theo format:
   ```
   feature/<ten-tinh-nang>
   fix/<ten-loi>
   hotfix/<xu-ly-khan-cap>
   ```

3. **Commit message rõ ràng**:
   ```
   feat: Thêm màn hình đăng nhập
   fix: Sửa lỗi thanh toán không thành công
   refactor: Tối ưu API room-service
   ```

4. **Đẩy branch lên GitHub**:
   ```bash
   git push origin feature/login-page
   ```

5. **Tạo Pull Request (PR) vào nhánh `main` hoặc `develop`**.

6. **Chờ review và approve trước khi merge**.

---

## 🔀 Hướng dẫn Pull Request (PR)

- Viết title và description rõ ràng.
- Gán reviewer.
- Chờ duyệt trước khi merge.

---

## ⚙️ Thiết lập môi trường

### 1. Clone project:
```bash
git clone https://github.com/khaitrandinh/dormitory-management.git
```

### 2. Cài đặt các service:
```bash
cd api-gateway && composer install
cd ../services/auth-service && composer install
cd ../services/room-service && composer install
cd ../services/payment-service && composer install
cd ../services/notification-service && composer install
```

### 3. Cài đặt frontend:
```bash
cd frontend
npm install
```

### 4. Thiết lập file `.env` và config theo service.

---

## 🤝 Liên hệ

- **Owner**: [Khai Tran Dinh](https://github.com/khaitrandinh)
- Email: khaidinhtran0312@gmail.com

---

## 🚀 Góp ý và phát triển

- Fork repo, tạo branch mới, tạo PR.
- Liên hệ trực tiếp để thảo luận!

> **Mọi commit và PR phải đảm bảo an toàn, đã qua review.**
