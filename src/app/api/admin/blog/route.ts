import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';
import { getBlogPosts, slugify, writeMarkdownDocument } from '@/lib/content';
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

export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const posts = await getBlogPosts();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, category, tags, description } = BlogPostSchema.parse(body);
    const slug = slugify(title);
    const existing = await getBlogPosts();

    if (existing.some((post) => post.slug === slug)) {
      return NextResponse.json({ error: 'A blog post with this title already exists' }, { status: 400 });
    }

    const postRecord = {
      slug,
      title,
      description: description || content.slice(0, 180),
      category: category || 'General',
      tags: tags || [],
      published: true,
      date: new Date().toISOString(),
      content,
    };

    const saved = await writeMarkdownDocument('blogs', postRecord, content);

    return NextResponse.json(
      {
        id: saved.slug,
        ...postRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}
