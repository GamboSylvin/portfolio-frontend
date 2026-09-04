import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/content';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const size = parseInt(searchParams.get('size') || '10');
    const category = searchParams.get('category');
    const query = searchParams.get('q');

    const posts = await getBlogPosts();
    const filteredPosts = posts.filter((post) => {
      if (category && post.category !== category) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return post.title.toLowerCase().includes(q) || post.content.toLowerCase().includes(q);
    });

    const start = page * size;
    const paginatedPosts = filteredPosts.slice(start, start + size);

    return NextResponse.json(
      {
        content: paginatedPosts.map((post) => ({
          id: post.slug,
          title: post.title,
          slug: post.slug,
          category: post.category || 'General',
          tags: post.tags.join(', '),
          viewCount: post.views || 0,
          createdAt: post.date || new Date().toISOString(),
        })),
        total: filteredPosts.length,
        page,
        pageSize: size,
        totalPages: Math.max(1, Math.ceil(filteredPosts.length / size || 1)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
