import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';

export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const token = extractToken(request.headers.get('authorization'));

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized: No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      );
    }

    return handler(request, { ...args, user: payload });
  };
}
