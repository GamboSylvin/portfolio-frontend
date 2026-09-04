'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/services/api'
import type { BlogPostSummary, PaginatedResponse } from '@/types'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get<PaginatedResponse<BlogPostSummary>>('/blog', { params: { page, q: query || undefined } })
      .then((response) => {
        setPosts(response.data.content)
        setTotalPages(response.data.totalPages)
      })
      .catch(() => setError('Unable to load blog posts.'))
  }, [page, query])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Blog</h1>
      <input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setPage(0)
        }}
        placeholder="Search articles"
        className="mb-8 w-full max-w-md rounded-lg border px-4 py-2 dark:bg-gray-900"
      />
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <p className="text-sm text-primary">{post.category}</p>
            <h2 className="mt-1 text-xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {post.tags} · {post.viewCount} views
            </p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-50">
          Previous
        </button>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  )
}

