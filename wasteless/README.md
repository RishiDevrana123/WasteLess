# WasteLess - Food Waste Reduction Platform 🌱

A fullstack MERN application designed to reduce food waste in Indian urban areas (Delhi-first) by connecting users, restaurants, and NGOs through smart inventory management, surplus marketplace, and donation flows.

![WasteLess Banner](https://via.placeholder.com/1200x400/22c55e/ffffff?text=WasteLess+-+Fight+Food+Waste+Together)

## 🌟 Features

### Core Features
- **🗄️ Smart Pantry Management**: Track food inventory with expiry date monitoring
- **⏰ Expiry Alerts**: Automated push/email/SMS notifications for expiring items
- **🍳 AI Recipe Suggestions**: Get personalized recipes based on available ingredients
- **🛒 Surplus Marketplace**: Buy discounted meals from restaurants
- **💳 Razorpay Integration**: Secure payment processing (demo mode included)
- **❤️ Donation Flow**: Share excess food with NGOs and volunteers
- **📊 Impact Analytics**: Track food saved, money saved, and CO₂ avoided
- **🔔 Real-time Notifications**: Socket.io powered live updates
- **📱 Responsive Design**: Mobile-first UI with Tailwind CSS

### Technical Highlights
- **Authentication**: JWT with refresh tokens, email verification, password reset
- **Background Jobs**: BullMQ for scheduled expiry checks
- **Geospatial Search**: Find nearby surplus meals and donations
- **Mock Services**: All external APIs have fallback implementations
- **Testing**: Unit, integration, and E2E tests
- **CI/CD**: GitHub Actions pipeline

---

## 🏗️ Architecture

```
wasteless/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Express + Node.js (JavaScript)
├── docker-compose.yml # Local development environment
└── .github/workflows/ # CI/CD pipelines
```

### Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS + Framer Motion
- React Router + React Query
- Zustand (state management)
- React Hook Form + Zod
- Chart.js + Leaflet
- Socket.io Client

**Backend**
- Node.js + Express (JavaScript)
- MongoDB + Mongoose
- JWT Authentication
- Socket.io
- BullMQ (Redis-based job queue)
- Nodemailer
- Razorpay SDK
- OpenAI API (optional)

**DevOps**
- Docker + Docker Compose
- GitHub Actions
- ESLint + Prettier
- Vitest + Cypress

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Redis (for background jobs)
- Git

### Option 1: Local Development (Without Docker)

1. **Clone the repository**
```bash
git clone <repository-url>
cd wasteless
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

3. **Setup environment variables**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MongoDB URI and other configs

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env if needed
```

4. **Start MongoDB and Redis**
```bash
# MongoDB (if running locally)
mongod

# Redis (if running locally)
redis-server
```

5. **Seed the database**
```bash
cd backend
npm run seed
```

6. **Start the application**
```bash
# From root directory
npm run dev

# Or start individually:
# Backend: cd backend && npm run dev
# Frontend: cd frontend && npm run dev
```

7. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- MailHog (if using Docker): http://localhost:8025

### Option 2: Docker Development

1. **Clone and setup**
```bash
git clone <repository-url>
cd wasteless
```

2. **Create environment files**
```bash
cp .env.example backend/.env
cp .env.example frontend/.env
```

3. **Start with Docker Compose**
```bash
docker-compose up
```

4. **Seed the database**
```bash
docker-compose exec backend npm run seed
```

5. **Access services**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: localhost:27017
- Redis: localhost:6379
- MailHog: http://localhost:8025

---

## 🔑 Demo Credentials

After seeding the database, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| User | rahul@example.com | password123 |
| User | priya@example.com | password123 |
| Restaurant | spicegarden@example.com | password123 |
| NGO | foodbank@example.com | password123 |

---

## 📝 Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/wasteless

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Razorpay (Optional - uses mock if not provided)
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret

# OpenAI (Optional - uses fallback algorithm if not provided)
OPENAI_API_KEY=sk-your-key

# Cloudinary (Optional - uses local mock)
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# FCM (Optional - uses mock)
FCM_SERVER_KEY=your-fcm-key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_your_key
```

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd backend
npm test                # Run all tests
npm run test:coverage   # With coverage report

# Frontend tests
cd frontend
npm test                # Run all tests

# E2E tests
npm run test:e2e        # Open Cypress
npm run test:e2e:headless  # Headless mode
```

### Test Coverage

The project aims for 70%+ test coverage on backend business logic:
- Authentication flow
- Inventory expiry detection
- Recipe suggestion algorithm
- Payment verification
- Donation claim flow
- Analytics calculations

---

## 🔄 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

```yaml
Lint → Test → Build
```

- **Lint**: ESLint + Prettier checks
- **Test**: Run all unit and integration tests
- **Build**: Verify production builds

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Inventory
- `GET /api/inventory` - Get user's inventory
- `POST /api/inventory` - Add item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item
- `GET /api/inventory/expiring` - Get expiring items

### Recipes
- `GET /api/recipes/suggestions` - Get recipe suggestions

### Marketplace
- `GET /api/marketplace` - Get surplus posts
- `GET /api/marketplace/nearby` - Search by location
- `POST /api/marketplace` - Create post (restaurant only)
- `PUT /api/marketplace/:id` - Update post
- `DELETE /api/marketplace/:id` - Delete post

### Donations
- `GET /api/donations` - Get donations
- `POST /api/donations` - Create donation
- `POST /api/donations/:id/claim` - Claim donation
- `POST /api/donations/:id/complete` - Mark complete

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/orders` - Get user orders

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/impact` - Get impact metrics

---

## 🎨 Design Decisions

### Why JavaScript (not TypeScript) for Backend?
Per user requirements, the backend uses JavaScript for simplicity while maintaining code quality through:
- JSDoc comments for type hints
- Comprehensive validation with express-validator
- Clear API contracts

### State Management
- **Zustand** chosen over Redux for simpler API and less boilerplate
- Perfect for demo app scope

### Background Jobs
- **BullMQ** over Agenda for modern Redis-based architecture
- Better for real-time expiry checks

### Mock Services
All external services have mock implementations:
- **Razorpay**: Mock payment flow for testing
- **OpenAI**: Fallback deterministic recipe algorithm
- **Email**: MailHog for local development
- **FCM**: Console logging for push notifications

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Render/Heroku/DigitalOcean)

```bash
cd backend
npm run build  # If using TypeScript
# Deploy with environment variables configured
```

### Environment Setup
1. Create MongoDB Atlas cluster
2. Setup Redis instance (Redis Cloud/Upstash)
3. Configure all environment variables
4. Run database migrations/seeds

---

## 🛠️ Development

### Code Style
```bash
# Format code
npm run format

# Lint
npm run lint
```

### Pre-commit Hooks
Husky runs linting and formatting before each commit.

### Project Structure

```
backend/src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Business logic
├── jobs/            # Background jobs
├── scripts/         # Utility scripts
└── server.js        # Entry point

frontend/src/
├── components/      # Reusable components
├── pages/           # Route pages
├── services/        # API clients
├── store/           # Zustand stores
├── hooks/           # Custom hooks
├── utils/           # Helper functions
└── App.jsx          # Root component
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- OpenAI for recipe generation API
- Razorpay for payment gateway
- MongoDB Atlas for database hosting
- Vercel for frontend hosting
- All open-source contributors

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@wasteless.com

---

**Made with ❤️ for a sustainable future**
