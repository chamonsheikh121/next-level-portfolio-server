# Portfolio Server - NestJS Backend

A professional, production-ready NestJS backend server with authentication, database integration, and best practices.

## 🚀 Features

- **NestJS Framework** - Modern, scalable Node.js framework
- **TypeScript** - Full type safety and modern JavaScript features
- **JWT Authentication** - Secure authentication with JSON Web Tokens
- **Database Integration** - PostgreSQL with TypeORM
- **Validation** - Request validation with class-validator
- **API Documentation** - Automatic Swagger/OpenAPI documentation
- **Error Handling** - Global exception filters
- **Response Transformation** - Consistent API responses
- **Security** - Guards, interceptors, and decorators
- **Testing** - Unit and E2E tests configured
- **Docker Support** - Containerization with Docker Compose
- **Environment Configuration** - Type-safe configuration management

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd next_level_portfolio_server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your database and JWT settings.

4. **Set up the database**:
   - Ensure PostgreSQL is running
   - Create a database named `portfolio_db` (or as specified in .env)
   - The application will auto-sync tables on first run (development mode)

## 🏃 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 🐳 Docker

Run the entire stack with Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Application server on port 3000

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users (Protected)
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check
- `GET /api/` - Application health check

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📁 Project Structure

```
src/
├── common/                  # Shared utilities
│   ├── decorators/          # Custom decorators
│   ├── filters/             # Exception filters
│   ├── guards/              # Auth guards
│   └── interceptors/        # Response interceptors
├── config/                  # Configuration files
│   ├── configuration.ts     # Environment configuration
│   └── database.config.ts   # Database configuration
├── modules/                 # Feature modules
│   ├── auth/                # Authentication module
│   │   ├── dto/             # Data transfer objects
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   └── users/               # Users module
│       ├── dto/
│       ├── entities/
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── users.module.ts
├── app.module.ts            # Root module
├── app.controller.ts        # Root controller
├── app.service.ts           # Root service
└── main.ts                  # Application entry point
```

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `API_PREFIX` | API route prefix | `api` |
| `DB_TYPE` | Database type | `postgres` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `DB_DATABASE` | Database name | `portfolio_db` |
| `DB_SYNCHRONIZE` | Auto-sync database | `true` |
| `JWT_SECRET` | JWT secret key | (required) |
| `JWT_EXPIRATION` | JWT expiration time | `1d` |
| `CORS_ENABLED` | Enable CORS | `true` |
| `CORS_ORIGIN` | CORS origin | `*` |

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with guards
- Request validation
- CORS configuration
- Input sanitization

## 📝 Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The compiled files will be in the `dist/` directory.

### Environment Setup
- Set `NODE_ENV=production`
- Set `DB_SYNCHRONIZE=false` (use migrations instead)
- Use strong `JWT_SECRET`
- Configure proper CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- NestJS Team
- TypeORM Team
- Everyone who contributed to this project
# next-level-portfolio-server
