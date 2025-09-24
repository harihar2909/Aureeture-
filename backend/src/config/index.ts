import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGODB_URI = process.env.MONGODB_URI!;
export const REDIS_URL = process.env.REDIS_URL!;
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY!;
export const FRONTEND_URL = process.env.FRONTEND_URL!;

if (!MONGODB_URI || !CLERK_SECRET_KEY || !FRONTEND_URL || !REDIS_URL) {
    console.error("FATAL ERROR: Missing required environment variables.");
    process.exit(1);
}
