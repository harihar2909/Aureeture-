import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { FRONTEND_URL } from './config';
import apiRouter from './routes';
import { errorHandler } from './middleware/error.middleware';

const app: Express = express();

// --- Core Middleware ---
// Security headers
app.use(helmet()); 
// Enable CORS for the frontend application
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// HTTP request logger
app.use(morgan('dev'));

// --- API Routes ---
app.use('/api', apiRouter);

// --- Health Check Route ---
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP' });
});

// --- 404 Not Found Handler ---
app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, error: { message: 'Resource not found' } });
});

// --- Centralized Error Handler ---
app.use(errorHandler);

export default app;
