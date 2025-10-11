# ZaloUTE Admin Backend

**NHÓM 1:**
- Phạm Danh Hưởng - 22110344
- Lê Đăng Hiếu - 22110322  
- Nguyễn Văn Luân - 22110373

ExpressJS backend để quản lý users của hệ thống ZaloUTE với JWT authentication và tích hợp MongoDB.

## 🚀 Tính năng chính

- ✅ **JWT Authentication** cho admin với role-based access control
- ✅ **CRUD Operations** cho user management
- ✅ **Pagination & Search** với tìm kiếm nâng cao
- ✅ **User Statistics** với biểu đồ thống kê
- ✅ **Database Integration** với MongoDB (tương thích NestJS backend)
- ✅ **Docker Support** với health check
- ✅ **Security Features** với password hashing và validation
- ✅ **Auto Admin Creation** tạo admin mặc định khi khởi động

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/login` | Đăng nhập admin | ❌ |
| `GET` | `/me` | Lấy thông tin admin hiện tại | ✅ |
| `POST` | `/logout` | Đăng xuất | ✅ |
| `POST` | `/create-admin` | Tạo admin mới | ✅ (Super Admin only) |

### User Management Routes (`/api/users`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | Danh sách users với pagination & search | ✅ |
| `GET` | `/:id` | Chi tiết user theo ID | ✅ |
| `GET` | `/stats` | Thống kê users | ✅ |
| `GET` | `/search` | Tìm kiếm users nâng cao | ✅ |
| `PATCH` | `/:id/toggle-status` | Khóa/mở khóa user | ✅ |
| `DELETE` | `/:id` | Xóa user | ✅ |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |

## 🛠️ Cài đặt và Chạy

### 1. Yêu cầu hệ thống
- Node.js >= 18.0.0
- MongoDB >= 5.0
- Docker & Docker Compose (tùy chọn)

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình Environment Variables
Tạo file `.env` trong thư mục gốc:

```env
# Database Configuration
MONGO_URI=mongodb://root:example@localhost:27017/zaloute?authSource=admin

# JWT Configuration
JWT_SECRET=admin_jwt_secret_key_2024_zaloute
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=4001
NODE_ENV=development

# Default Admin Account
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_EMAIL=admin@zaloute.com
```

### 4. Chạy ứng dụng

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

#### Docker Mode
```bash
# Build và chạy với Docker Compose
npm run docker:up

# Xem logs
npm run docker:logs

# Dừng services
npm run docker:down
```

## 🔐 Default Admin Account

Khi khởi động lần đầu, hệ thống sẽ tự động tạo admin account mặc định:

- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@zaloute.com`
- **Role:** `super_admin`

> ⚠️ **Lưu ý bảo mật:** Thay đổi thông tin đăng nhập mặc định trong production!

## 🏗️ Cấu trúc dự án

```
ZaloUTE_admin_be/
├── src/
│   ├── config/
│   │   └── database.js           # MongoDB connection & default admin creation
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   └── user.controller.js    # User management logic
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── errorHandler.js       # Global error handling
│   ├── models/
│   │   ├── User.js               # User model (tương thích NestJS)
│   │   └── Admin.js              # Admin model
│   ├── routes/
│   │   ├── auth.routes.js        # Authentication routes
│   │   └── user.routes.js        # User management routes
│   ├── services/
│   │   ├── auth.service.js       # Authentication business logic
│   │   └── user.service.js       # User management business logic
│   └── app.js                    # Express app configuration
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile                    # Docker image configuration
├── healthcheck.js                # Docker health check
├── .env                          # Environment variables
├── package.json                  # Dependencies & scripts
└── server.js                     # Application entry point
```

## 🗄️ Database Schema

### Users Collection (Shared với NestJS)
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  phone: String,
  avatarUrl: String,
  avatarPublicId: String,
  isActive: Boolean,
  otp: String,
  otpExpiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Admins Collection
```javascript
{
  _id: ObjectId,
  username: String,
  password: String,
  email: String,
  role: String, // 'super_admin', 'admin', 'moderator'
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🐳 Docker Configuration

### MongoDB Container Integration
- **Container name:** `zalo_ute_mongo`
- **Database:** `zaloute`
- **Username:** `root`
- **Password:** `example`
- **Port:** `27017`

### Admin Backend Container
- **Container name:** `zalo_ute_admin`
- **Port:** `4001`
- **Health check:** Enabled với interval 30s

### Docker Commands
```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run

# Start với Docker Compose
npm run docker:up

# Stop services
npm run docker:down

# View logs
npm run docker:logs
```

## 🔒 Security Features

- **JWT Authentication** với token expiration
- **Password Hashing** sử dụng bcryptjs (12 rounds)
- **Role-based Access Control** (Super Admin, Admin, Moderator)
- **Input Validation** và sanitization
- **CORS Configuration** cho cross-origin requests
- **Error Handling** với proper HTTP status codes
- **Request Timeout** (10 seconds)

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": { // Chỉ có khi cần
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🔧 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run docker:build # Build Docker image
npm run docker:run   # Run Docker container
npm run docker:up    # Start with Docker Compose
npm run docker:down  # Stop Docker services
npm run docker:logs  # View Docker logs
```

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://root:example@localhost:27017/zaloute?authSource=admin` |
| `JWT_SECRET` | JWT signing secret | `admin_jwt_secret_key_2024_zaloute` |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` |
| `PORT` | Server port | `4001` |
| `NODE_ENV` | Environment mode | `development` |

## 🌐 Integration với ZaloUTE_be

Admin backend được thiết kế để tích hợp hoàn hảo với NestJS backend:

1. **Shared Database:** Sử dụng cùng MongoDB container
2. **Shared Collections:** Users collection được share với NestJS
3. **Network Integration:** Cùng Docker network `zalo_ute_network`
4. **Data Consistency:** Đảm bảo tính nhất quán dữ liệu giữa các services

## 📝 API Documentation

### Authentication Flow
1. **Login:** `POST /api/auth/login` với username/password
2. **Get Token:** Nhận JWT token từ response
3. **Use Token:** Gửi token trong header `Authorization: Bearer <token>`
4. **Auto Logout:** Token tự động expire sau 24h

### User Management Examples

#### Get All Users
```bash
curl -H "Authorization: Bearer <token>" \
     "http://localhost:4001/api/users?page=1&limit=10&search=john"
```

#### Toggle User Status
```bash
curl -X PATCH \
     -H "Authorization: Bearer <token>" \
     "http://localhost:4001/api/users/64f1234567890abcdef12345/toggle-status"
```

#### Get User Statistics
```bash
curl -H "Authorization: Bearer <token>" \
     "http://localhost:4001/api/users/stats"
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Kiểm tra MongoDB có đang chạy không
   - Verify connection string trong `.env`
   - Check network connectivity

2. **JWT Token Invalid**
   - Kiểm tra JWT_SECRET trong `.env`
   - Verify token expiration
   - Check Authorization header format

3. **Port Already in Use**
   - Thay đổi PORT trong `.env`
   - Kill process đang sử dụng port
   - Restart Docker containers

### Health Check
```bash
curl http://localhost:4001/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "ZaloUTE Admin Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📄 License

ISC License

---

**Phát triển bởi Nhóm 1 - CNPMM**