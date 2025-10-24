# ZaloUTE Admin System

**NHÓM 1:**

- Phạm Danh Hưởng - 22110344
- Lê Đăng Hiếu - 22110322
- Nguyễn Văn Luân - 22110373

Hệ thống quản trị toàn diện cho ZaloUTE bao gồm Backend API và Frontend Dashboard được xây dựng với công nghệ hiện đại.

## 🏗️ Kiến trúc hệ thống

```
ZaloUTE_admin/
├── ZaloUTE_admin_be/          # Backend API (ExpressJS)
│   ├── src/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── README.md
├── ZaloUTE_admin_fe/          # Frontend Dashboard (ReactJS)
│   ├── src/
│   ├── public/
│   └── README.md
└── README.md                  # Tài liệu tổng quan (file này)
```

## 🚀 Tính năng chính

### 🔐 Authentication & Authorization

- JWT Authentication với role-based access control
- Tự động tạo admin mặc định khi khởi động
- Protected routes với middleware security
- Session management và auto logout

### 👥 User Management

- **CRUD Operations**: Xem, tạo, sửa, xóa users
- **Advanced Search**: Tìm kiếm theo username, email, phone
- **User Status Control**: Khóa/mở khóa tài khoản user
- **Pagination**: Hỗ trợ phân trang và lọc dữ liệu
- **Statistics Dashboard**: Thống kê users theo thời gian thực

### 💬 Message Management

- **Media Message Viewing**: Xem tin nhắn hình ảnh, video, file
- **Content Moderation**: Ẩn tin nhắn không phù hợp
- **Message Recovery**: Khôi phục tin nhắn đã ẩn
- **Permanent Deletion**: Xóa vĩnh viễn tin nhắn
- **Audit Trail**: Theo dõi lịch sử thao tác quản trị

### 📊 Admin Dashboard

- **Real-time Statistics**: Thống kê users và tin nhắn theo thời gian thực
- **System Health**: Monitoring trạng thái hệ thống
- **Activity Logs**: Theo dõi hoạt động admin
- **Responsive Design**: Tương thích mobile và desktop

## 🛠️ Công nghệ sử dụng

### Backend (ExpressJS)

- **Framework**: Express.js với Node.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, cors
- **Development**: nodemon, dotenv
- **Containerization**: Docker & Docker Compose

### Frontend (ReactJS)

- **Framework**: React 18 với TypeScript
- **UI Library**: Ant Design (antd)
- **Routing**: React Router DOM
- **HTTP Client**: Axios với interceptors
- **State Management**: React Context API
- **Date Handling**: Moment.js
- **Build Tool**: Create React App

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js >= 18.0.0
- MongoDB >= 5.0
- Docker & Docker Compose (khuyến nghị)
- npm hoặc yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd ZaloUTE_admin
```

### 2. Setup Backend

```bash
cd ZaloUTE_admin_be

# Cài đặt dependencies
npm install

# Cấu hình environment variables
cp .env.example .env
# Chỉnh sửa file .env theo môi trường của bạn

# Chạy với Docker (khuyến nghị)
npm run docker:up

# Hoặc chạy development mode
npm run dev
```

### 3. Setup Frontend

```bash
cd ../ZaloUTE_admin_fe

# Cài đặt dependencies
npm install

# Cấu hình API URL
echo "REACT_APP_API_URL=http://localhost:4001/api" > .env

# Chạy development server
npm start
```

### 4. Truy cập ứng dụng

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:4001
- **API Health Check**: http://localhost:4001/health

## 🔐 Thông tin đăng nhập mặc định

Hệ thống sẽ tự động tạo admin account mặc định:

- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@zaloute.com`
- **Role**: `super_admin`

> ⚠️ **Lưu ý bảo mật**: Thay đổi thông tin đăng nhập mặc định trong production!

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint                 | Description              | Auth Required    |
| ------ | ------------------------ | ------------------------ | ---------------- |
| `POST` | `/api/auth/login`        | Đăng nhập admin          | ❌               |
| `GET`  | `/api/auth/me`           | Thông tin admin hiện tại | ✅               |
| `POST` | `/api/auth/logout`       | Đăng xuất                | ✅               |
| `POST` | `/api/auth/create-admin` | Tạo admin mới            | ✅ (Super Admin) |

### User Management Routes

| Method   | Endpoint                       | Description       | Auth Required |
| -------- | ------------------------------ | ----------------- | ------------- |
| `GET`    | `/api/users`                   | Danh sách users   | ✅            |
| `GET`    | `/api/users/:id`               | Chi tiết user     | ✅            |
| `GET`    | `/api/users/stats`             | Thống kê users    | ✅            |
| `PATCH`  | `/api/users/:id/toggle-status` | Khóa/mở khóa user | ✅            |
| `DELETE` | `/api/users/:id`               | Xóa user          | ✅            |

### Message Management Routes

| Method   | Endpoint                      | Description        | Auth Required |
| -------- | ----------------------------- | ------------------ | ------------- |
| `GET`    | `/api/messages/media`         | Tin nhắn media     | ✅            |
| `POST`   | `/api/messages/:id/hide`      | Ẩn tin nhắn        | ✅            |
| `GET`    | `/api/messages/hidden`        | Tin nhắn đã ẩn     | ✅            |
| `POST`   | `/api/messages/:id/restore`   | Khôi phục tin nhắn | ✅            |
| `DELETE` | `/api/messages/:id/permanent` | Xóa vĩnh viễn      | ✅            |

## 🗄️ Database Schema

### Users Collection (Shared với ZaloUTE_be)

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
  isActive: Boolean,
  otp: String,
  otpExpiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection

```javascript
{
  _id: ObjectId,
  conversation: ObjectId, // Reference to Conversation
  sender: ObjectId,       // Reference to User
  content: String,
  type: String,          // 'text', 'image', 'video', 'file', 'emoji', 'sticker'
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Hidden Messages Collection

```javascript
{
  _id: ObjectId,
  messageId: ObjectId,    // Reference to Message
  originalContent: String,
  originalType: String,
  hiddenBy: ObjectId,     // Reference to Admin
  hiddenAt: Date,
  reason: String,
  status: String,         // 'hidden', 'restored', 'deleted'
  createdAt: Date,
  updatedAt: Date
}
```

## 🐳 Docker Deployment

### Sử dụng Docker Compose (Khuyến nghị)

```bash
# Chạy toàn bộ hệ thống
cd ZaloUTE_admin_be
npm run docker:up

# Xem logs
npm run docker:logs

# Dừng services
npm run docker:down
```

### Services Include:

- **MongoDB**: Container database
- **Admin Backend**: API server
- **Network**: `zalo_ute_network` để kết nối các services

## 🔒 Security Features

### Backend Security

- **JWT Authentication** với token expiration
- **Password Hashing** sử dụng bcryptjs (12 rounds)
- **Role-based Access Control** (Super Admin, Admin, Moderator)
- **Input Validation** và sanitization
- **CORS Configuration** cho cross-origin requests
- **Rate Limiting** và request timeout

### Frontend Security

- **Protected Routes** với authentication check
- **Auto Token Refresh** và logout khi hết hạn
- **XSS Protection** với input sanitization
- **Secure HTTP** requests với Axios interceptors
- **Role-based UI** rendering

## 📱 Responsive Design

### Mobile Support

- **Mobile-first approach** với Ant Design
- **Collapsible sidebar** trên mobile devices
- **Touch-friendly interface** cho tablet và phone
- **Responsive tables** với horizontal scroll
- **Adaptive layouts** cho mọi screen size

### Browser Support

- Chrome (khuyến nghị)
- Firefox
- Safari
- Edge

## 🔧 Development Workflow

### Backend Development

```bash
cd ZaloUTE_admin_be

# Development với auto-reload
npm run dev

# Production build
npm start

# Docker development
npm run docker:up
```

### Frontend Development

```bash
cd ZaloUTE_admin_fe

# Development server
npm start

# Production build
npm run build

# Run tests
npm test
```

## 🌐 Environment Configuration

### Backend (.env)

```env
# Database
MONGO_URI=mongodb://root:example@localhost:27017/zaloute?authSource=admin

# JWT
JWT_SECRET=admin_jwt_secret_key_2024_zaloute
JWT_EXPIRES_IN=24h

# Server
PORT=4001
NODE_ENV=development

# Default Admin
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=admin123
DEFAULT_ADMIN_EMAIL=admin@zaloute.com
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:4001/api
```

## 🚨 Troubleshooting

### Common Issues

1. **Backend không kết nối được MongoDB**

   - Kiểm tra MongoDB container đang chạy
   - Verify connection string trong `.env`
   - Check Docker network connectivity

2. **Frontend không gọi được API**

   - Kiểm tra `REACT_APP_API_URL` trong `.env`
   - Verify backend đang chạy trên port 4001
   - Check CORS configuration

3. **JWT Token Invalid**

   - Verify `JWT_SECRET` trong backend `.env`
   - Check token expiration time
   - Clear browser localStorage và login lại

4. **Docker Issues**
   - Restart Docker containers: `npm run docker:down && npm run docker:up`
   - Check port conflicts: `lsof -i :4001` hoặc `netstat -ano | findstr :4001`
   - Verify Docker compose file configuration

### Health Checks

```bash
# Backend health
curl http://localhost:4001/health

# Frontend accessibility
curl http://localhost:3000
```

## 📊 Monitoring & Analytics

### Available Metrics

- **User Activity**: Login frequency, active users
- **Message Statistics**: Media messages count, hidden messages
- **System Health**: API response times, error rates
- **Admin Actions**: Audit trail cho tất cả admin actions

### Logging

- **Backend**: Console logging với timestamp
- **Frontend**: Browser console cho development
- **Docker**: Container logs với `npm run docker:logs`

## 🎯 Performance Optimization

### Backend

- **MongoDB Indexing** cho faster queries
- **Pagination** để giảm tải database
- **Connection Pooling** với Mongoose
- **Error Handling** để prevent crashes

### Frontend

- **Code Splitting** với React.lazy
- **Memoization** với React.memo
- **Optimized Re-renders** với proper state management
- **Bundle Optimization** với Create React App

## 📈 Future Enhancements

### Planned Features

- [ ] **Real-time Notifications** với WebSocket
- [ ] **Advanced Analytics** với charts và graphs
- [ ] **Bulk Operations** cho user management
- [ ] **Export/Import** functionality
- [ ] **Advanced Message Filtering** với AI
- [ ] **Multi-language Support** (i18n)
- [ ] **Dark Mode** support
- [ ] **Mobile App** với React Native

### Technical Improvements

- [ ] **Microservices Architecture** refactoring
- [ ] **Redis Caching** cho better performance
- [ ] **Kubernetes Deployment** support
- [ ] **CI/CD Pipeline** với GitHub Actions
- [ ] **Automated Testing** với Jest và Cypress
- [ ] **API Documentation** với Swagger

## 🤝 Contributing

### Development Guidelines

1. Fork repository và tạo feature branch
2. Follow coding standards (ESLint + Prettier)
3. Write meaningful commit messages
4. Add tests cho new features
5. Update documentation khi cần thiết
6. Submit pull request với clear description

### Code Standards

- **Backend**: ESLint với Airbnb config
- **Frontend**: TypeScript strict mode
- **Naming**: camelCase cho variables, PascalCase cho components
- **Comments**: JSDoc format cho functions

## 📄 License

ISC License - Free for educational and commercial use

## 📞 Support & Contact

### Team Members

- **Phạm Danh Hưởng** - 22110344 - Backend Development
- **Lê Đăng Hiếu** - 22110322 - Frontend Development
- **Nguyễn Văn Luân** - 22110373 - System Architecture

### Documentation

- [Backend README](./ZaloUTE_admin_be/README.md)
- [Frontend README](./ZaloUTE_admin_fe/README.md)
- [API Documentation](./docs/api.md) (Coming soon)

---

**© 2025 Nhóm 1 - Công nghệ Phần mềm Mới**
