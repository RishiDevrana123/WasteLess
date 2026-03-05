import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import connectDB from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { initializeJobs } from './jobs/index.js';


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



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Make io accessible to routes
app.set('io', io);

// Socket.io connection
io.on('connection', socket => {
    console.log('Client connected:', socket.id);

    socket.on('join', userId => {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

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

// Initialize background jobs
initializeJobs();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export { io };
