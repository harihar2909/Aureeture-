import { Request, Response, NextFunction } from 'express';
import { clerkClient, createClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import User from '../models/user.model';

// This middleware will protect routes that require authentication
// It attaches `req.auth` which contains session and user information
export const clerkAuthMiddleware = createClerkExpressWithAuth({
    // You can add options here if needed, like authorizedParties
}).withAuth;

// Example of a custom middleware if more fine-grained control is needed
export const customAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, error: { message: 'Unauthorized: No token provided' }});
        }
        const token = authHeader.split(' ')[1];
        
        // The `authenticateRequest` method will verify the token and throw an error if invalid
        const requestState = await clerkClient.authenticateRequest({
            headerToken: token
        });

        // Attach auth object to the request for downstream handlers
        const auth = requestState.toAuth();
        (req as any).auth = auth;

        // Ensure a local User document exists for this Clerk user
        const clerkUserId = auth?.userId;
        if (clerkUserId) {
            const existing = await User.findOne({ clerkId: clerkUserId });
            if (!existing) {
                try {
                    const clerkUser = await clerkClient.users.getUser(clerkUserId);
                    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
                    await User.create({
                        clerkId: clerkUserId,
                        email: email || `${clerkUserId}@unknown.local`,
                        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || undefined,
                        avatar: clerkUser.imageUrl,
                    });
                } catch (e) {
                    // Don't block requests if user hydration fails; downstream services may still fail,
                    // but we avoid turning every request into 401.
                    console.warn('Failed to auto-create local user for Clerk user:', clerkUserId, e);
                }
            }
        }
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ success: false, error: { message: 'Unauthorized: Invalid token' }});
    }
};



