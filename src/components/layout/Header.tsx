'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { cn } from '@/utils/cn'
import { useEffect, useState } from 'react'
import MenuIcon from '../ui/MenuIcon'
import { motion, AnimatePresence } from 'framer-motion'

const sectionLinks = [
  { hash: '#home', label: 'Home' },
  { hash: '#about', label: 'About' },
  { hash: '#projects', label: 'Projects' },
  { hash: '#contact', label: 'Contact' },
]

export default function Header() {
  const [isClicked, setIsClicked] = useState(false)
  const pathname = usePathname()
  const [hash, setHash] = useState('')
  const isLanding = pathname === '/'

  useEffect(() => {
    setHash(window.location.hash)
    const onHashChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/10 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/#home" className="text-lg font-bold text-primary">
          Sylvin dev
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {sectionLinks.map((link) => (
            <a
              key={link.hash}
              href={isLanding ? link.hash : `/${link.hash}`}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isLanding && (hash === link.hash || (link.hash === '#home' && !hash))
                  ? 'text-primary'
                  : 'text-gray-600 dark:text-gray-300',
              )}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/blog"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === '/blog' ? 'text-primary' : 'text-gray-600 dark:text-gray-300',
            )}
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center">
          <button type="button" onClick={() => setIsClicked(true)} className="mr-6 md:hidden">
            <MenuIcon className="h-8 w-8 text-primary" />
          </button>
          <ThemeToggle />
        </div>

        <AnimatePresence>
          {isClicked && (
            <motion.nav
              initial={{ width: 0, height: 0, opacity: 0, borderRadius: '0 0 100% 100%' }}
              animate={{ width: '100vw', height: '90vh', opacity: 1, borderRadius: '2% 2% 2% 100%' }}
              exit={{ width: 0, height: 0, opacity: 0, borderRadius: '0 0 100% 100%' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute right-0 top-full flex flex-col items-start gap-6 overflow-hidden bg-white p-8 shadow-lg dark:bg-gray-900 md:hidden"
            >
              {sectionLinks.map((link) => (
                <Link
                  key={link.hash}
                  href={isLanding ? `/#home` : `/${link.hash}`}
                  onClick={() => setIsClicked(false)}
                  className={cn(
                    'ml-6 text-sm font-medium transition-colors hover:text-primary',
                    isLanding && (hash === link.hash || (link.hash === '#home' && !hash))
                      ? 'text-primary'
                      : 'text-gray-600 dark:text-gray-300',
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/blog"
                onClick={() => setIsClicked(false)}
                className={cn(
                  'ml-6 text-sm font-medium transition-colors hover:text-primary',
                  pathname === '/blog' ? 'text-primary' : 'text-gray-600 dark:text-gray-300',
                )}
              >
                Blog
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
