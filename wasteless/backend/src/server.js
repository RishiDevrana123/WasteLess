import { createServer } from 'http';
import { Server } from 'socket.io';
import 'dotenv/config';
import connectDB from './config/database.js';
import { initializeJobs } from './jobs/index.js';
import app from './app.js';

const httpServer = createServer(app);

// Retrieve CORS options set in app.js
const corsOptions = app.get('corsOptions');

const io = new Server(httpServer, {
    cors: corsOptions,
});

// Connect to MongoDB
connectDB();

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

// Initialize background jobs
initializeJobs();

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

export { io };
