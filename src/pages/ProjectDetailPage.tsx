'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/services/api'
import type { Project } from '@/types'

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api
      .get<Project>(`/projects/${id}`)
      .then((response) => setProject(response.data))
      .catch(() => setError('Project not found.'))
  }, [id])

  if (error) return <div className="mx-auto max-w-6xl px-4 py-16 text-red-500">{error}</div>
  if (!project) return <div className="mx-auto max-w-6xl px-4 py-16 text-gray-500">Loading project…</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">{project.title}</h1>
      {project.image && <img src={project.image} alt="" className="mb-6 max-h-96 w-full rounded-xl object-cover" />}
      <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
      <p className="mt-4 text-primary">{project.technologies}</p>
      {project.githubUrl && (
        <a className="mt-6 inline-block text-primary hover:underline" href={project.githubUrl} target="_blank" rel="noreferrer">
          View source code
        </a>
      )}
    </div>
  )
}

