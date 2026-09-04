import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-32 text-center">
      <h1 className="mb-4 text-6xl font-bold text-primary">404</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">Page not found.</p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
