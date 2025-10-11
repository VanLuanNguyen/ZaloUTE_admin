# ZaloUTE Admin Frontend
**NHÓM 1:**
- Phạm Danh Hưởng - 22110344
- Lê Đăng Hiếu - 22110322  
- Nguyễn Văn Luân - 22110373
Giao diện web quản trị cho hệ thống ZaloUTE được xây dựng bằng ReactJS và TypeScript.

## Tính năng

- **Đăng nhập/Đăng xuất**: Xác thực admin với JWT
- **Dashboard**: Thống kê tổng quan hệ thống
- **Quản lý người dùng**: 
  - Xem danh sách người dùng với phân trang
  - Tìm kiếm người dùng
  - Khóa/mở khóa người dùng
  - Xóa người dùng
  - Xem chi tiết người dùng
- **Tạo admin**: Chỉ dành cho super_admin
- **Responsive design**: Tương thích với mobile và desktop

## Công nghệ sử dụng

- React 18
- TypeScript
- Ant Design (UI Components)
- React Router DOM
- Axios (HTTP Client)
- Moment.js (Date handling)

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cấu hình API URL trong file `.env`:
```
REACT_APP_API_URL=http://localhost:4001/api
```

3. Chạy ứng dụng:
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Cấu trúc thư mục

```
src/
├── components/          # Các component tái sử dụng
│   ├── Auth/           # Component đăng nhập
│   └── Layout/         # Layout chính
├── contexts/           # React Context
├── pages/              # Các trang chính
├── services/           # API services
├── types/              # TypeScript types
└── App.tsx            # Component chính
```

## API Integration

Ứng dụng tích hợp với các API từ backend:

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin admin
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/create-admin` - Tạo admin (super_admin only)

### User Management
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/stats` - Thống kê users
- `GET /api/users/:id` - Lấy thông tin user
- `PATCH /api/users/:id/toggle-status` - Khóa/mở khóa user
- `DELETE /api/users/:id` - Xóa user

## Tính năng bảo mật

- JWT Authentication
- Protected Routes
- Role-based access control (Admin/Super Admin)
- Auto logout khi token hết hạn
- Secure HTTP requests với Axios interceptors

## Responsive Design

- Mobile-first approach
- Ant Design responsive grid system
- Collapsible sidebar trên mobile
- Touch-friendly interface

## Development

```bash
# Chạy development server
npm start

# Build cho production
npm run build

# Chạy tests
npm test
```