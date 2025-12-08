import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, newName, secret } = await request.json();

    // Verify secret
    if (secret !== 'update-admin-name-2025') {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 403 }
      );
    }

    // Update user name
    const result = await db
      .update(users)
      .set({ 
        name: newName,
        updatedAt: new Date()
      })
      .where(eq(users.email, email))
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: `Admin name updated to ${newName}`,
      user: result[0]
    });

  } catch (error) {
    console.error('Error updating admin name:', error);
    return NextResponse.json(
      { error: 'Failed to update admin name' },
      { status: 500 }
    );
  }
}
