import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
 
export const auth = betterAuth({
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

// Session validation helper
export async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
}