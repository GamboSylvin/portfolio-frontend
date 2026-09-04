'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import ProjectsPage from '@/pages/ProjectsPage'
import ContactPage from '@/pages/ContactPage'

export default function LandingPage() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash) return
    const id = hash.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        })
      })
    }
  }, [pathname])

  return (
    <>
      <section id="home">
        <HomePage />
      </section>
      <section id="about">
        <AboutPage />
      </section>
      <section id="projects">
        <ProjectsPage />
      </section>
      <section id="contact">
        <ContactPage />
      </section>
    </>
  )
}
