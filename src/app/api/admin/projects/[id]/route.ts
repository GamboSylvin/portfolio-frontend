import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';
import { deleteMarkdownDocument, getProjects, slugify, writeMarkdownDocument } from '@/lib/content';
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingProjects = await getProjects();
    const project = existingProjects.find((item) => item.slug === params.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, image, technologies, githubUrl, content = project.content } = ProjectSchema.parse(body);
    const newSlug = slugify(title);
    const duplicate = existingProjects.find((item) => item.slug !== params.id && item.slug === newSlug);
    if (duplicate) {
      return NextResponse.json({ error: 'A project with this title already exists' }, { status: 400 });
    }

    const nextProject = {
      slug: newSlug,
      title,
      description,
      image: image || undefined,
      technologies: technologies || [],
      githubUrl: githubUrl || undefined,
      published: true,
      date: project.date || new Date().toISOString(),
      content,
    };

    if (newSlug !== params.id) {
      await deleteMarkdownDocument('projects', params.id);
    }

    const saved = await writeMarkdownDocument('projects', nextProject, content, newSlug);

    return NextResponse.json({ id: saved.slug, ...nextProject }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
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

    const existingProjects = await getProjects();
    const project = existingProjects.find((item) => item.slug === params.id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await deleteMarkdownDocument('projects', params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
