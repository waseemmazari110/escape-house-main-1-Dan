import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { 
  getCurrentUserWithRole, 
  isAdmin,
  unauthorizedResponse
} from "@/lib/auth-roles";

export async function GET() {
  try {
    const currentUser = await getCurrentUserWithRole();
    
    // Must be admin
    if (!currentUser || !isAdmin(currentUser)) {
      return unauthorizedResponse('Admin access required');
    }

    // Get all users with their details
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    return NextResponse.json({
      users: allUsers,
      total: allUsers.length,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
