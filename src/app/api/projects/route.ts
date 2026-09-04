import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/content';

export async function GET(request: NextRequest) {
  try {
    const projects = await getProjects();

    return NextResponse.json(
      projects.map((project) => ({
        id: project.slug,
        title: project.title,
        description: project.description,
        image: project.image || null,
        technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl || null,
        createdAt: project.date || new Date().toISOString(),
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
