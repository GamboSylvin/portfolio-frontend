import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = ContactSchema.parse(body);

    await sendContactEmail(name, email, subject, message);

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully',
        id: Date.now(),
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
