import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
 
export const auth = betterAuth({
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
	secret: process.env.BETTER_AUTH_SECRET!,
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {    
		enabled: true,
	},
	trustedOrigins: [
		"http://localhost:3000",
		"http://127.0.0.1:3000",
		"http://10.102.139.154:3000",
		"https://escape-house-main-1-dan.vercel.app",
		"https://escape-house-main-7fbg9los-waseem-mazaris-projects.vercel.app",
		"https://escape-house-main-1-j9r9wzg18-waseem-mazaris-projects.vercel.app",
		"https://groupescapehouses.co.uk",
		"https://www.groupescapehouses.co.uk",
	],
	plugins: [bearer()],
	// Add user data to session
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "guest",
			}
		}
	}
});

// Extended user type with role
export interface ExtendedUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role?: string;
}

// Extended session type
export interface ExtendedSession {
  user: ExtendedUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

// Helper function to get user role from session
export function getUserRole(session: any): string {
  return (session?.user as any)?.role || 'guest';
}

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
}