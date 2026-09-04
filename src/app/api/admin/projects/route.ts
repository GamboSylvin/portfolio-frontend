import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';
import { getProjects, slugify } from '@/lib/content';
import { saveContentDocument } from '@/lib/github-content';
import { z } from 'zod';

const ProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  githubUrl: z.string().optional(),
  content: z.string().optional(),
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

    const projects = await getProjects();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, image, technologies, githubUrl, content = '' } = ProjectSchema.parse(body);
    const slug = slugify(title);
    const existing = await getProjects();

    if (existing.some((project) => project.slug === slug)) {
      return NextResponse.json({ error: 'A project with this title already exists' }, { status: 400 });
    }

    const projectRecord = {
      slug,
      title,
      description,
      image: image || undefined,
      technologies: technologies || [],
      githubUrl: githubUrl || undefined,
      published: true,
      date: new Date().toISOString(),
      content,
    };

    const saved = await saveContentDocument('projects', projectRecord, content);

    return NextResponse.json(
      {
        id: saved.slug,
        ...projectRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'GitHub content storage is not configured') {
      return NextResponse.json({ error: 'GitHub content storage is not configured' }, { status: 503 });
    }

    if (error instanceof Error && 'status' in error && (error as Error & { status?: number }).status === 422) {
      return NextResponse.json({ error: 'A project with this title already exists' }, { status: 409 });
    }

    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
