import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/authService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await loginUser({ email, password });

    if (!result.success) {
      return NextResponse.json(result, { status: 401 });
    }

    // In production, set HTTP-only cookie here
    const response = NextResponse.json(result);
    
    // Set a simple cookie (in production, use secure HTTP-only cookies with JWT)
    response.cookies.set('user', JSON.stringify(result.user), {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}
