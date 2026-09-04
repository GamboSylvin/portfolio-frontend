import { NextRequest, NextResponse } from 'next/server';
import { getProjectBySlug } from '@/lib/content';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await getProjectBySlug(params.id);

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: project.slug,
        title: project.title,
        description: project.description,
        image: project.image || null,
        technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl || null,
        createdAt: project.date || new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}
