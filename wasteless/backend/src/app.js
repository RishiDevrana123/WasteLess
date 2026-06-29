import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import recipeRoutes from './routes/recipe.routes.js';
import aiRoutes from './routes/ai.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import shoppingRoutes from './routes/shopping.routes.js';
import paymentRoutes from './routes/payment.routes.js';

import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// CORS: Support multiple origins (comma-separated in CLIENT_URL env var)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map(origin => origin.trim());

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // Also allow any Vercel preview deployments for this project
        if (origin.includes('vercel.app')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
// Only enable request logging if NOT in test mode (keeps test output clean)
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Export corsOptions for socket.io to use in server.js
app.set('corsOptions', corsOptions);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;
