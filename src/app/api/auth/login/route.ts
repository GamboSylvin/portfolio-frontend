import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { getAdminUser } from '@/lib/content';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    const user = await getAdminUser();

    if (!user || user.email !== email || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: 1,
      email: user.email,
    });

    return NextResponse.json(
      {
        token,
        user: {
          id: 1,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
