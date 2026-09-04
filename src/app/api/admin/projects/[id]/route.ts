import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';
import { slugify } from '@/lib/content';
import { deleteContentDocument, saveContentDocument } from '@/lib/github-content';
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

    const body = await request.json();
    const { title, description, image, technologies, githubUrl, content = '' } = ProjectSchema.parse(body);
    const newSlug = slugify(title);

    const nextProject = {
      slug: newSlug,
      title,
      description,
      image: image || undefined,
      technologies: technologies || [],
      githubUrl: githubUrl || undefined,
      published: true,
      date: new Date().toISOString(),
      content,
    };

    const saved = await saveContentDocument('projects', nextProject, content, params.id);

    return NextResponse.json({ id: saved.slug, ...nextProject }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error instanceof Error && error.message === 'GitHub content storage is not configured') {
      return NextResponse.json({ error: 'GitHub content storage is not configured' }, { status: 503 });
    }

    if (error instanceof Error && 'status' in error && (error as Error & { status?: number }).status === 404) {
      return NextResponse.json({ error: 'Project file not found in GitHub' }, { status: 404 });
    }

    if (error instanceof Error && 'status' in error && (error as Error & { status?: number }).status === 422) {
      return NextResponse.json({ error: 'A project with this title already exists' }, { status: 409 });
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

    await deleteContentDocument('projects', params.id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === 'GitHub content storage is not configured') {
      return NextResponse.json({ error: 'GitHub content storage is not configured' }, { status: 503 });
    }

    if (error instanceof Error && 'status' in error && (error as Error & { status?: number }).status === 404) {
      return NextResponse.json({ error: 'Project file not found in GitHub' }, { status: 404 });
    }

    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
