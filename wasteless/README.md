# WasteLess 🌱
### An AI-Powered Smart Food Waste Reduction Platform

WasteLess is a full-stack MERN web application that helps Indian households dramatically reduce food waste through intelligent pantry management, AI-generated recipes, real-time expiry alerts, and financial donation support. Built as a production-grade resume project with comprehensive automated testing and clean architecture.

---

## 🌟 Features

### 🧠 AI-Powered Core
- **Smart Pantry Entry** — Describe your groceries in plain English (e.g., *"I bought 1kg tomatoes and 500g paneer"*) and the Groq AI will automatically parse and categorize everything into your inventory.
- **AI Recipe Generator** — Get personalized Indian recipe suggestions based on your available pantry items, powered by Groq's `llama-3.1-8b-instant` model. Recipes include ingredients, instructions, match percentage, and expiry-optimized suggestions.
- **Storage Advice** — Ask the AI for expert advice on how to best store any ingredient to maximize its shelf-life.

### 🥫 Smart Pantry Management
- Add, edit, and delete food items with quantity, unit, category, and expiry date.
- Automatic status detection — items are categorized as `fresh`, `expiring-soon`, or `expired` based on their expiry dates.
- Background job (node-cron) runs every hour to check expiry and dispatch smart notifications.

### 📊 Impact Analytics Dashboard
- Visualize your personal food-saving footprint — meals saved, money saved, and estimated CO₂ reduction.
- Track your pantry usage history over time.

### 🔔 Real-time Notifications
- Live Socket.IO-powered notifications alert you instantly when items are about to expire.
- In-app notification center with read/unread management.

### 💳 Financial Donations (Stripe)
- Support the WasteLess mission by making secure financial donations via Stripe Checkout.
- Select donation tiers (₹100, ₹250, ₹500, ₹1000) or type a custom amount.
- Stripe webhooks record completed transactions in the database.

### 🔐 Authentication
- Secure JWT-based authentication with token expiry.
- Email verification on signup (SMTP or Mock mode).
- User profile management with avatar upload support.

### 🛒 Shopping List
- Automatically generate a shopping list from recipe missing ingredients.
- Mark items as purchased and manage your grocery list.

---

## 🏗️ Architecture

```
WasteLess/
└── wasteless/
    ├── frontend/      # React 18 + Vite SPA
    ├── backend/       # Node.js + Express REST API
    ├── docker-compose.yml
    └── README.md
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18 + Vite** | Core UI framework & build tool |
| **Vanilla CSS** | Custom premium styling with glassmorphism & dark mode |
| **Framer Motion** | Page transitions & micro-animations |
| **React Router v6** | Client-side navigation & protected routes |
| **Zustand** | Lightweight global state management |
| **Lucide React** | Icon library |
| **Socket.io Client** | Real-time notification updates |
| **Axios** | HTTP API client |
| **React Hot Toast** | In-app notification toasts |
| **Three.js** | 3D food scene on Home page |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **JWT** | Stateless authentication |
| **Socket.io** | Real-time bidirectional communication |
| **Groq AI (llama-3.1-8b-instant)** | Recipe generation, smart entry parsing, storage advice |
| **Stripe** | Secure financial donation checkout |
| **Nodemailer** | Email verification & notifications |
| **node-cron** | Scheduled background jobs for expiry checks |
| **Helmet + CORS** | Security headers & cross-origin policy |
| **Bcrypt.js** | Password hashing |

### Testing
| Technology | Purpose |
|---|---|
| **Vitest** | Test runner |
| **Supertest** | HTTP endpoint testing |
| **Fast-Check** | Property-based chaos testing (1000+ permutations) |

---

## 🧪 Testing Strategy

WasteLess uses **Property-Based Chaos Testing** — instead of writing test cases by hand, we use `fast-check` to automatically generate thousands of random, extreme, and malformed inputs and verify the backend never crashes.

### Run the Test Suites

```bash
cd backend

# Authentication API — 1,000 randomized login attempts
npx vitest run test/auth.test.js

# Pantry API — 1,000 randomized pantry additions with edge-case inputs
npx vitest run test/pantry.test.js

# AI Recipe API — 1,000 randomized AI generation requests
npx vitest run test/recipe.test.js

# Systems (Profile, Payments, Analytics) — 500+ permutations each
npx vitest run test/systems.test.js
```

### What the Tests Verify
- The server **never** returns a `500 Internal Server Error` for any user input, no matter how malformed.
- Mongoose `ValidationError` and `CastError` are safely converted to `400 Bad Request` responses.
- Invalid donation amounts (NaN, null, negative) are rejected cleanly before reaching Stripe.
- AI recipe generation handles empty/gibberish ingredient arrays without crashing.

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Stripe account (optional — runs in mock mode without it)

### 1. Clone the repository
```bash
git clone https://github.com/RishiDevrana123/WasteLess.git
cd WasteLess/wasteless
```

### 2. Install dependencies
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 3. Set up environment variables

Create `backend/.env`:
```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# Database (MongoDB Atlas or local)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/wasteless

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# AI (Groq)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Email (Optional — runs in mock mode if omitted)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Stripe (Optional — runs in mock mode if omitted)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 4. Start the development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 5. Open the app
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

---

## 📝 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login with email & password |
| GET | `/api/auth/verify-email/:token` | Verify email address |

### Inventory (Pantry)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/inventory` | Get user's pantry items |
| POST | `/api/inventory` | Add a new item |
| PUT | `/api/inventory/:id` | Update an item |
| DELETE | `/api/inventory/:id` | Delete an item |
| GET | `/api/inventory/expiring` | Get items expiring within 3 days |
| POST | `/api/inventory/smart-entry` | AI-powered natural language item addition |

### Recipes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/recipes/generate` | Generate AI recipes from ingredients |
| GET | `/api/recipes` | Get saved recipes |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics` | Get personal impact dashboard stats |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | Get all notifications |
| PATCH | `/api/notifications/:id/read` | Mark a notification as read |
| PATCH | `/api/notifications/read-all` | Mark all as read |

### Payments (Donations)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-donation` | Create Stripe Checkout session |
| POST | `/api/payments/webhook` | Stripe webhook handler |

### Shopping List
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/shopping` | Get shopping list |
| POST | `/api/shopping/add` | Add items to list |
| PATCH | `/api/shopping/:id/purchased` | Mark item as purchased |
| DELETE | `/api/shopping/clear` | Clear the list |

### Users (Profile)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/profile` | Get user profile |
| PUT | `/api/users/profile` | Update name, avatar, phone |

---

## 📁 Project Structure

```
wasteless/
├── backend/
│   ├── src/
│   │   ├── config/          # JWT, Stripe, Email, Groq configs
│   │   ├── controllers/     # Request handlers for each route
│   │   ├── middleware/       # Auth guard, global error handler
│   │   ├── models/          # Mongoose schemas (User, InventoryItem, etc.)
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic (Groq AI, Email, Notifications)
│   │   ├── jobs/            # node-cron scheduled expiry checker
│   │   ├── scripts/         # Database seeder
│   │   └── server.js        # Express app entry point
│   └── test/
│       ├── auth.test.js     # 1,000-case Auth chaos test
│       ├── pantry.test.js   # 1,000-case Pantry chaos test
│       ├── recipe.test.js   # 1,000-case AI Recipe chaos test
│       └── systems.test.js  # Profile, Payments & Analytics tests
│
├── frontend/
│   └── src/
│       ├── components/      # Navbar, Footer, 3D scene, Modals
│       ├── pages/           # Home, Login, Signup, Pantry, Recipes, etc.
│       ├── services/        # Axios API service layer
│       ├── store/           # Zustand auth & notification stores
│       └── hooks/           # useSocket hook
│
├── TEST_STRATEGY.md         # Full testing documentation
├── docker-compose.yml
└── README.md
```

---

## 🚢 Deployment

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) and import your GitHub repository.
2. Set **Root Directory** to `wasteless/frontend`.
3. Set environment variable: `VITE_API_URL=https://your-backend-url.onrender.com/api`
4. Deploy!

### Backend → Render
1. Go to [render.com](https://render.com) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `wasteless/backend`.
4. Set **Start Command** to `node src/server.js`.
5. Add all environment variables from your `.env` file.
6. Deploy!

---

## 🔒 Security

- All API routes that require authentication are protected by the `protect` middleware (JWT verification).
- Passwords are hashed using **bcrypt** with 12 salt rounds.
- API keys and secrets are stored exclusively in `.env` files, which are excluded from version control via `.gitignore`.
- **Helmet.js** sets secure HTTP headers on every response.
- **Input validation** prevents malformed data from ever reaching the database layer.

---

## 👨‍💻 Author

**Rishi Devrana**
- GitHub: [@RishiDevrana123](https://github.com/RishiDevrana123)

---

*Made with ❤️ for a sustainable future 🌍*
