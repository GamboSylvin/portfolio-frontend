import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}
