import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';
import { getBlogPosts, getProjects } from '@/lib/content';

export async function GET(request: NextRequest) {
  try {
    const token = extractToken(request.headers.get('authorization'));
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const [posts, projects] = await Promise.all([getBlogPosts(), getProjects()]);

    return NextResponse.json(
      {
        totalVisitors: 0,
        todayVisitors: 0,
        totalBlogPosts: posts.length,
        totalProjects: projects.length,
        totalMessages: 0,
        totalBlogViews: posts.reduce((sum, post) => sum + (post.views ?? 0), 0),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
