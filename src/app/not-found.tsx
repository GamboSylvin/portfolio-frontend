import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold">Page not found</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">The page you are looking for does not exist.</p>
      <Link href="/" className="rounded-lg bg-primary px-4 py-2 text-white">
        Go home
      </Link>
    </div>
  )
}
