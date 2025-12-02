import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get user from cookie
    const userCookie = request.cookies.get('user');

    if (!userCookie) {
      console.log('No user cookie found');
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookie.value);
    console.log('User found in cookie:', user.email);

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to get user' },
      { status: 500 }
    );
  }
}
