export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-background-dark">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Full Stack Developer Portfolio. All rights reserved.</p>
      </div>
    </footer>
  )
}
