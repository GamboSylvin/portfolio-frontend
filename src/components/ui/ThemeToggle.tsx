import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/utils/cn'

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={cn(
        'relative inline-flex h-9 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isDark ? 'bg-gray-700' : 'bg-gray-200',
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none relative inline-flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          isDark ? 'translate-x-7' : 'translate-x-0',
        )}
      >
        {isDark ? (
          <MoonIcon className="h-5 w-5 text-gray-700" />
        ) : (
          <SunIcon className="h-5 w-5 text-amber-500" />
        )}
      </span>
      <SunIcon
        className={cn(
          'pointer-events-none absolute left-1.5 top-1.5 h-5 w-5 transition-opacity',
          isDark ? 'text-gray-500 opacity-50' : 'text-amber-500 opacity-0',
        )}
      />
      <MoonIcon
        className={cn(
          'pointer-events-none absolute right-1.5 top-1.5 h-5 w-5 transition-opacity',
          isDark ? 'text-gray-300 opacity-0' : 'text-gray-400 opacity-50',
        )}
      />
    </button>
  )
}
