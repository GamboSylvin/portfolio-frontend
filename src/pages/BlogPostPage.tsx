'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import api from '@/services/api'
import type { BlogPost } from '@/types'

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>()
  const slug = params?.slug
  const [post, setPost] = useState<BlogPost | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    api
      .get<BlogPost>(`/blog/${slug}`)
      .then((response) => setPost(response.data))
      .catch(() => setError('Article not found.'))
  }, [slug])

  if (error) return <div className="mx-auto max-w-3xl px-4 py-16 text-red-500">{error}</div>
  if (!post) return <div className="mx-auto max-w-3xl px-4 py-16 text-gray-500">Loading article…</div>

  return (
    <article className="prose mx-auto max-w-3xl px-4 py-16 dark:prose-invert">
      <p className="text-primary">{post.category}</p>
      <h1 className="text-4xl font-semibold">{post.title}</h1>
      <p className="text-sm text-gray-500">
        {post.tags} · {post.viewCount} views
      </p>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
    </article>
  )
}

