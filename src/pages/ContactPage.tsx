'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Button from '@/components/ui/Button'
import api from '@/services/api'
import type { ContactFormData } from '@/types'
import { easeOut, motion } from 'framer-motion'

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSubmitted(false)

    try {
      await api.post('/contact', form)
      setForm({ name: '', email: '', message: '' })
      setSubmitted(true)
    } catch {
      setError('Unable to send your message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => setSubmitted(false), 5000)
      return () => clearTimeout(timer)
    }
    if (error) {
      const timer = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(timer)
    }
  }, [submitted, error])

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Contact</h1>
      <div className="flex flex-wrap-reverse gap-10 md:flex-nowrap">
        <form onSubmit={submit} className="max-w-xl space-y-4">
          <input
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Name"
            className="w-full rounded-lg border px-4 py-2 dark:bg-gray-900"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-2 dark:bg-gray-900"
          />
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            placeholder="Message"
            className="w-full rounded-lg border px-4 py-2 dark:bg-gray-900"
          />
          <Button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send Message'}</Button>
          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="w-fit rounded-2xl bg-green-50/15 px-6 py-2 text-green-500"
            >
              Message sent successfully.
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="w-fit rounded-2xl bg-red-50/15 px-6 py-2 text-red-500"
            >
              {error}
            </motion.p>
          )}
        </form>
        <div className="flex flex-col items-center justify-center overflow-hidden md:basis-1/2">
          <motion.div initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: easeOut }} className="mb-8 h-48 w-48">
            <img src="https://res.cloudinary.com/dosaqiiuk/image/upload/portfolio-pic-contact" alt="pic" className="h-full w-full rounded-full object-cover shadow-2xl dark:shadow-gray-700" />
          </motion.div>
          <motion.p initial={{ x: 100, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, ease: easeOut }} className="mb-8 max-w-3xl px-4 text-center text-gray-600 dark:text-gray-300">
            <span className="font-bold">Have a project in mind</span>, a collaboration opportunity, or just want to say hello? I’d love to hear from you. Feel free to reach out, and I’ll get back to you as soon as I can.
          </motion.p>
        </div>
      </div>
    </div>
  )
}

