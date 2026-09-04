import { renderMarkdownDocument } from '@/lib/content';

type Collection = 'blogs' | 'projects';

type GitHubFile = {
  sha: string;
};

type GitHubError = Error & {
  status?: number;
};

const githubApiUrl = 'https://api.github.com';

function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repository = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repository) {
    throw new Error('GitHub content storage is not configured');
  }

  return { token, owner, repository, branch };
}

function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

function contentPath(collection: Collection, slug: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Invalid content slug');
  }
  return `content/${collection}/${slug}.mdx`;
}

async function githubRequest<T>(path: string, init: RequestInit): Promise<T> {
  const { token } = getGitHubConfig();
  const response = await fetch(`${githubApiUrl}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    const error: GitHubError = new Error(`GitHub API request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

async function getFile(path: string): Promise<GitHubFile | null> {
  const { owner, repository, branch } = getGitHubConfig();

  try {
    return await githubRequest<GitHubFile>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodePath(path)}?ref=${encodeURIComponent(branch)}`,
      { method: 'GET' }
    );
  } catch (error) {
    if ((error as GitHubError).status === 404) return null;
    throw error;
  }
}

export async function saveContentDocument(
  collection: Collection,
  document: Record<string, any>,
  body: string,
  existingSlug?: string
): Promise<{ slug: string; path: string }> {
  const { owner, repository, branch } = getGitHubConfig();
  const slug = String(document.slug);
  const path = contentPath(collection, slug);
  const existingPath = existingSlug ? contentPath(collection, existingSlug) : path;
  const existingFile = await getFile(existingPath);

  if (existingSlug && !existingFile) {
    throw Object.assign(new Error('Content file not found'), { status: 404 });
  }

  const content = Buffer.from(renderMarkdownDocument(document, body), 'utf8').toString('base64');

  await githubRequest(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodePath(path)}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message: `${existingFile ? 'Update' : 'Create'} ${collection.slice(0, -1)}: ${slug}`,
        content,
        branch,
        ...(existingFile && path === existingPath ? { sha: existingFile.sha } : {}),
      }),
    }
  );

  if (existingSlug && existingSlug !== slug) {
    await deleteContentDocument(collection, existingSlug);
  }

  return { slug, path };
}

export async function deleteContentDocument(collection: Collection, slug: string): Promise<void> {
  const { owner, repository, branch } = getGitHubConfig();
  const path = contentPath(collection, slug);
  const existingFile = await getFile(path);

  if (!existingFile) {
    throw Object.assign(new Error('Content file not found'), { status: 404 });
  }

  await githubRequest(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodePath(path)}`,
    {
      method: 'DELETE',
      body: JSON.stringify({
        message: `Delete ${collection.slice(0, -1)}: ${slug}`,
        sha: existingFile.sha,
        branch,
      }),
    }
  );
}