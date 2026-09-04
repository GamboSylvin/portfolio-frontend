'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { readStoredToken } from '@/lib/admin';

interface AnalyticsData {
  totalVisitors: number;
  todayVisitors: number;
  totalBlogPosts: number;
  totalProjects: number;
  totalMessages: number;
  totalBlogViews: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = readStoredToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    async function loadAnalytics() {
      try {
        const res = await fetch('/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const payload = await res.json();
        if (!res.ok) {
          throw new Error((payload as { error?: string }).error || 'Unable to load analytics');
        }

        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load analytics');
      }
    }

    loadAnalytics();
  }, [router]);

  const stats = [
    { label: 'Total Projects', value: data?.totalProjects ?? 0 },
    { label: 'Total Blog Posts', value: data?.totalBlogPosts ?? 0 },
    { label: 'Total Visitors', value: data?.totalVisitors ?? 0 },
    { label: 'Blog Views', value: data?.totalBlogViews ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Overview</p>
        <h2 className="mt-2 text-3xl font-bold text-white">Dashboard</h2>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-red-300">{error}</div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
