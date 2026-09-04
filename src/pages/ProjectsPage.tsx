'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/services/api'
import type { Project } from '@/types'
import { easeOut, motion } from 'framer-motion'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    api
      .get<Project[]>('/projects')
      .then((response) => setProjects(response.data))
      .catch(() => setError('Unable to load projects right now.'))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Projects</h1>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut }}
          className="text-red-500"
        >
          {error}
        </motion.p>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <motion.article
            initial={{ opacity: 0, y: 200 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut }}
            key={project.id}
            className="rounded-xl border border-gray-200 p-6 dark:border-gray-800"
          >
            {project.image && (
              <img
                src={`https://res.cloudinary.com/dosaqiiuk/image/upload/${project.image}`}
                alt=""
                className="mb-4 h-44 w-full rounded-lg object-cover"
              />
            )}
            <h2 className="text-xl font-semibold">
              <Link href={`/projects/${project.id}`} className="hover:text-primary">
                {project.title}
              </Link>
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-3">{project.description}</p>
            <p className="mt-4 text-sm text-primary">{project.technologies}</p>
          </motion.article>
        ))}
      </div>
      {!error && projects.length === 0 && <p className="text-gray-500">No projects published yet.</p>}
    </div>
  )
}
