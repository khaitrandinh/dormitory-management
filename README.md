> # 🏠 Dormitory Management System

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

## 🎯 Giới thiệu

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
├── services/
│   ├── auth-service/        # Xác thực và phân quyền (Laravel)
│   ├── room-service/        # Quản lý phòng (Laravel)
│   ├── payment-service/     # Quản lý thanh toán (Laravel)
│   ├── notification-service/ # Quản lý thông báo (Laravel)
│   └── student-service/     # Quản lý sinh viên (đang phát triển)
└── README.md                # File hướng dẫn
```

### 📦 Cấu trúc thư mục Frontend

```
frontend/
├── public/                 # File tĩnh
├── src/                    # Mã nguồn chính
│   ├── Components/         # Các component tái sử dụng
│   ├── Pages/              # Các trang (Home, Login, Dashboard)
│   ├── App.js              # App component, định nghĩa routes
│   ├── App.css             # CSS cho App component
│   ├── index.js            # Điểm khởi động app
│   ├── index.css           # CSS toàn cục
├── .gitignore              # Bỏ qua thư mục, file không cần commit
├── Dockerfile              # Docker
├── package.json            # Quản lý package JS
├── package-lock.json       # Khóa phiên bản package
└── README.md               # Hướng dẫn chi tiết frontend
```

### ⚙️ Cấu trúc Laravel Service (ví dụ auth-service)

```
services/auth-service/
├── app/                   # Controllers, Models, Middleware, Services
├── bootstrap/             # Khởi tạo Laravel
├── config/                # Cấu hình hệ thống
├── database/              # Migrations, Seeds
├── lang/                  # Đa ngôn ngữ
├── public/                # File tĩnh
├── resources/             # Views, assets
├── routes/                # API routes
├── storage/               # Log, cache, uploads
├── tests/                 # Test
├── .env.example           # Mẫu biến môi trường
├── Dockerfile             # Docker
└── composer.json          # Packages PHP
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

6. **Chờ review và được approve trước khi merge vào `main`.**

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

### 2. Thiết lập file `.env`:
- Copy các file `.env.example` thành `.env` ở mỗi service và frontend.
- Điều chỉnh biến môi trường phù hợp hệ thống.

### 3. Build và khởi chạy toàn bộ hệ thống bằng Docker Compose:
```bash
docker-compose up --build
```

### 4. Truy cập các service:
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8000 (hoặc cổng bạn cấu hình)
- Các service khác sẽ chạy nội bộ theo cấu hình docker-compose.

### 5. Các lệnh hỗ trợ khác:
- Dừng hệ thống:
```bash
docker-compose down
```
- Xem log:
```bash
docker-compose logs -f
```

---

## 🤝 Liên hệ

- **Owner**: [Khai Tran Dinh](https://github.com/khaitrandinh)
- Email: khaidinhtran0312@gmail.com
- **Dev**: [Tran Sy Chuong](https://github.com/TranSenpai)
- Email: chuongtran975@gmail.com
- - **Dev**: [Nguyen Huu Thang](https://github.com/nguyenhuuthang113)
- Email: huuthang030603@gmail.com
---

## 🚀 Góp ý và phát triển

- Fork repo, tạo branch mới, tạo PR.
- Liên hệ trực tiếp để thảo luận thêm!

> **Mọi commit và PR phải đảm bảo an toàn, đã qua review.**
