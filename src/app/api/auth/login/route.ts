import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  userType: z.enum(['admin', 'operator', 'supporter']),
  rememberMe: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          errors: validationResult.error.errors,
          success: false 
        },
        { status: 400 }
      );
    }

    const { email, password, userType, rememberMe } = validationResult.data;

    // Mock authentication - in a real app, this would verify against a database
    const mockUsers = [
      { email: 'admin@example.com', password: 'admin123', userType: 'admin', id: 1 },
      { email: 'operator@example.com', password: 'operator123', userType: 'operator', id: 2 },
      { email: 'supporter@example.com', password: 'supporter123', userType: 'supporter', id: 3 },
    ];

    const user = mockUsers.find(u => u.email === email && u.password === password && u.userType === userType);

    if (!user) {
      return NextResponse.json(
        { 
          error: 'Invalid credentials', 
          success: false 
        },
        { status: 401 }
      );
    }

    // In a real app, you would generate a JWT token here
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;

    return NextResponse.json({
      data: {
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
        },
        token,
        rememberMe,
      },
      success: true,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
