import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/lib/content';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: post.slug,
        title: post.title,
        slug: post.slug,
        category: post.category || 'General',
        tags: post.tags.join(', '),
        viewCount: post.views || 0,
        content: post.content,
        createdAt: post.date || new Date().toISOString(),
        updatedAt: post.date || new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}
