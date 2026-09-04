'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearAuthSession, readStoredUser } from '@/lib/admin';
import { useEffect, useMemo, useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/blogs', label: 'Blogs' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setUser(readStoredUser());
  }, [pathname]);

  const isLoginPage = useMemo(() => pathname === '/admin/login', [pathname]);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/30 backdrop-blur-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-400">Portfolio Admin</p>
              <h1 className="mt-1 text-2xl font-bold text-white">Control Center</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200">
                {user?.name || 'Admin'}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500 hover:text-cyan-300"
              >
                Logout
              </button>
            </div>
          </div>

          <nav className="mt-5 flex flex-wrap gap-3">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'rounded-lg px-4 py-2 text-sm font-medium transition',
                    active
                      ? 'bg-cyan-500 text-slate-950'
                      : 'border border-slate-700 bg-slate-800 text-slate-300 hover:border-cyan-500 hover:text-cyan-300',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main>{children}</main>
      </div>
    </div>
  );
}
