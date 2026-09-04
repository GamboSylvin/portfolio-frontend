import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';
import { slugify } from '@/lib/content';
import { deleteContentDocument, saveContentDocument } from '@/lib/github-content';
import { z } from 'zod';

const BlogPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
});

function checkAuth(request: NextRequest) {
  const token = extractToken(request.headers.get('authorization'));
  if (!token || !verifyToken(token)) {
    return null;
  }
  return token;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, category, tags, description } = BlogPostSchema.parse(body);
    const newSlug = slugify(title);

    const nextPost = {
      slug: newSlug,
      title,
      description: description || content.slice(0, 180),
      category: category || 'General',
      tags: tags || [],
      published: true,
      date: new Date().toISOString(),
      content,
    };

    const saved = await saveContentDocument('blogs', nextPost, content, params.id);
    return NextResponse.json({ id: saved.slug, ...nextPost }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'GitHub content storage is not configured') {
      return NextResponse.json({ error: 'GitHub content storage is not configured' }, { status: 503 });
    }

    if (error instanceof Error && 'status' in error && (error as Error & { status?: number }).status === 404) {
      return NextResponse.json({ error: 'Blog post file not found in GitHub' }, { status: 404 });
    }

    if (error instanceof Error && 'status' in error && (error as Error & { status?: number }).status === 422) {
      return NextResponse.json({ error: 'A blog post with this title already exists' }, { status: 409 });
    }

    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteContentDocument('blogs', params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'GitHub content storage is not configured') {
      return NextResponse.json({ error: 'GitHub content storage is not configured' }, { status: 503 });
    }

    if (error instanceof Error && 'status' in error && (error as Error & { status?: number }).status === 404) {
      return NextResponse.json({ error: 'Blog post file not found in GitHub' }, { status: 404 });
    }

    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
