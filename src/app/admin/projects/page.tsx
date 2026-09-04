'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readStoredToken } from '@/lib/admin';

type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string | null;
  technologies?: string[];
  githubUrl?: string | null;
  content?: string;
  date?: string;
};

const emptyForm = {
  title: '',
  description: '',
  image: '',
  githubUrl: '',
  technologies: '',
  content: '',
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  async function fetchProjects() {
    const token = readStoredToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    try {
      const res = await fetch('/api/admin/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      if (!res.ok) throw new Error((payload as { error?: string }).error || 'Failed to fetch projects');
      setItems(Array.isArray(payload) ? payload : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [router]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const token = readStoredToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const body = {
        title: form.title,
        description: form.description,
        image: form.image || undefined,
        technologies: form.technologies
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        githubUrl: form.githubUrl || undefined,
        content: form.content || form.description,
      };

      const url = editingSlug ? `/api/admin/projects/${editingSlug}` : '/api/admin/projects';
      const method = editingSlug ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const payload = await res.json();
      if (!res.ok) throw new Error((payload as { error?: string }).error || 'Failed to save project');

      setForm(emptyForm);
      setEditingSlug(null);
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(item: ProjectItem) {
    setEditingSlug(item.slug);
    setForm({
      title: item.title,
      description: item.description,
      image: item.image || '',
      githubUrl: item.githubUrl || '',
      technologies: (item.technologies || []).join(', '),
      content: item.content || item.description,
    });
  }

  async function handleDelete(slug: string) {
    const token = readStoredToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    try {
      const res = await fetch(`/api/admin/projects/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error((payload as { error?: string }).error || 'Failed to delete project');
      }
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  }

  if (loading) {
    return <div className="text-slate-400">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-white">Projects</h2>
      </div>

      {error ? <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-300">{error}</div> : null}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" required />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Project image URL</label>
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" required />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Technologies</label>
            <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} placeholder="React, Next.js, Tailwind" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">GitHub URL</label>
            <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Content</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white" placeholder="Detailed project description or notes..." />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60">
            {saving ? 'Saving...' : editingSlug ? 'Update project' : 'Add project'}
          </button>
          {editingSlug ? (
            <button type="button" onClick={() => { setEditingSlug(null); setForm(emptyForm); }} className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-200">
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{item.slug}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)} className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200">Edit</button>
                <button onClick={() => handleDelete(item.slug)} className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-300">Delete</button>
              </div>
            </div>
            <p className="mt-3 text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
