import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';
import { deleteMarkdownDocument, getBlogPosts, slugify, writeMarkdownDocument } from '@/lib/content';
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

    const existingPosts = await getBlogPosts();
    const post = existingPosts.find((item) => item.slug === params.id);
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, content, category, tags, description } = BlogPostSchema.parse(body);
    const newSlug = slugify(title);
    const duplicate = existingPosts.find((item) => item.slug !== params.id && item.slug === newSlug);
    if (duplicate) {
      return NextResponse.json({ error: 'A blog post with this title already exists' }, { status: 400 });
    }

    const nextPost = {
      slug: newSlug,
      title,
      description: description || content.slice(0, 180),
      category: category || 'General',
      tags: tags || [],
      published: true,
      date: post.date || new Date().toISOString(),
      content,
    };

    if (newSlug !== params.id) {
      await deleteMarkdownDocument('blogs', params.id);
    }

    const saved = await writeMarkdownDocument('blogs', nextPost, content, newSlug);
    return NextResponse.json({ id: saved.slug, ...nextPost }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
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

    const existingPosts = await getBlogPosts();
    const post = existingPosts.find((item) => item.slug === params.id);
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await deleteMarkdownDocument('blogs', params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
