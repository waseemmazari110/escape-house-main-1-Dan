import { NextResponse } from 'next/server';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, secret } = await request.json();
    
    // Simple security check
    if (secret !== 'update-admin-role-2025') {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
    }
    
    // Update the user role to admin
    await db
      .update(user)
      .set({ role: 'admin' })
      .where(eq(user.email, email));
    
    return NextResponse.json({ 
      success: true, 
      message: `User ${email} updated to admin role successfully!`,
      adminLogin: 'http://localhost:3000/admin/login'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
