import fs from 'fs/promises';
import path from 'path';

export interface AdminUser {
  email: string;
  password: string;
  name: string;
  role: string;
}

export interface ProjectContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  date?: string;
  featured?: boolean;
  published?: boolean;
  content: string;
}

export interface BlogContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  category?: string;
  tags: string[];
  image?: string;
  date?: string;
  published?: boolean;
  content: string;
  views?: number;
}

interface ParsedFrontmatter {
  data: Record<string, any>;
  content: string;
}

function parseScalar(value: string): string | boolean | number | null {
  const text = value.trim();
  if (!text) return null;
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1);
  }
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (/^\d+$/.test(text)) return Number(text);
  return text;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseFrontmatter(raw: string): ParsedFrontmatter {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  if (!match) {
    return { data: {}, content: raw.trim() };
  }

  const lines = match[1].split(/\r?\n/);
  const result: Record<string, any> = {};
  let currentKey: string | null = null;
  let listValues: string[] = [];

  const finalizeList = () => {
    if (currentKey) {
      result[currentKey] = listValues;
      currentKey = null;
      listValues = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('- ')) {
      if (!currentKey) continue;
      listValues.push(String(parseScalar(trimmed.replace(/^-\s*/, '')) ?? ''));
      continue;
    }

    const keyMatch = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyMatch) continue;

    const [, key, value] = keyMatch;
    if (value.trim() === '') {
      finalizeList();
      currentKey = key;
      listValues = [];
      continue;
    }

    finalizeList();
    result[key] = parseScalar(value);
  }

  finalizeList();

  return {
    data: result,
    content: raw.slice(match[0].length).trim(),
  };
}

function serializeFrontmatter(data: Record<string, any>): string {
  const lines: string[] = ['---'];

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      value.forEach((item) => {
        lines.push(`  - ${String(item)}`);
      });
      continue;
    }

    lines.push(`${key}: ${String(value)}`);
  }

  lines.push('---');
  return `${lines.join('\n')}\n\n`;
}

async function readMarkdownFiles(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
          return readMarkdownFiles(fullPath);
        }
        if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
          return [fullPath];
        }
        return [];
      })
    );
    return files.flat();
  } catch {
    return [];
  }
}

async function readDocument(filePath: string): Promise<Record<string, any>> {
  const raw = await fs.readFile(filePath, 'utf-8');
  const { data, content } = parseFrontmatter(raw);

  return {
    ...data,
    content,
  };
}

export function renderMarkdownDocument(document: Record<string, any>, content: string): string {
  const slug = String(document.slug || slugify(String(document.title || 'untitled')));
  const { content: body, ...meta } = document;

  const data = {
    ...meta,
    slug,
    published: meta.published ?? true,
  };

  return `${serializeFrontmatter(data)}${body?.trim() || content.trim()}\n`;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const filePath = path.join(process.cwd(), 'content', 'admin', 'user.mdx');

  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data } = parseFrontmatter(raw);

    if (!data.email || !data.password) {
      return null;
    }

    return {
      email: String(data.email),
      password: String(data.password),
      name: String(data.name || 'Gambo Sylvin'),
      role: String(data.role || 'admin'),
    };
  } catch {
    return null;
  }
}

export async function getProjects(): Promise<ProjectContent[]> {
  const dirPath = path.join(process.cwd(), 'content', 'projects');
  const files = await readMarkdownFiles(dirPath);

  const projects = await Promise.all(
    files.map(async (filePath) => {
      const doc = await readDocument(filePath);
      const slug = String(doc.slug || path.basename(filePath, path.extname(filePath)));
      return {
        id: slug,
        slug,
        title: String(doc.title || slug),
        description: String(doc.description || ''),
        image: doc.image ? String(doc.image) : undefined,
        technologies: Array.isArray(doc.technologies) ? doc.technologies.map(String) : [],
        githubUrl: doc.githubUrl ? String(doc.githubUrl) : undefined,
        liveUrl: doc.liveUrl ? String(doc.liveUrl) : undefined,
        date: doc.date ? String(doc.date) : undefined,
        featured: Boolean(doc.featured),
        published: doc.published !== false,
        content: String(doc.content || ''),
      } as ProjectContent;
    })
  );

  return projects.filter((project) => project.published !== false).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export async function getProjectBySlug(slug: string): Promise<ProjectContent | null> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) || null;
}

export async function getBlogPosts(): Promise<BlogContent[]> {
  const dirPath = path.join(process.cwd(), 'content', 'blogs');
  const files = await readMarkdownFiles(dirPath);

  const posts = await Promise.all(
    files.map(async (filePath) => {
      const doc = await readDocument(filePath);
      const slug = String(doc.slug || path.basename(filePath, path.extname(filePath)));
      return {
        id: slug,
        slug,
        title: String(doc.title || slug),
        description: String(doc.description || ''),
        category: doc.category ? String(doc.category) : undefined,
        tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
        image: doc.image ? String(doc.image) : undefined,
        date: doc.date ? String(doc.date) : undefined,
        published: doc.published !== false,
        content: String(doc.content || ''),
        views: typeof doc.views === 'number' ? doc.views : 0,
      } as BlogContent;
    })
  );

  return posts.filter((post) => post.published !== false).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogContent | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) || null;
}

