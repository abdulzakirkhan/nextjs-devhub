'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './theme-toggle';
import { NAVIGATION_CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
              <span className="text-lg font-bold">N</span>
            </div>
            <span className="hidden font-bold text-sm sm:inline-block">
              Next.js DevHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex xl:items-center xl:gap-4">
            <Link
              href="/blog"
              className={cn(
                'text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
                pathname === '/blog' ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-600 dark:text-zinc-400'
              )}
            >
              Blog
            </Link>
            {NAVIGATION_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
                  pathname?.startsWith(`/category/${category.slug}`)
                    ? 'text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-600 dark:text-zinc-400'
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              aria-expanded={isSearchOpen}
              aria-controls="site-search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            <ThemeToggle />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div id="site-search" className="py-4 md:pb-4">
            <form onSubmit={handleSearch} role="search" className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <label className="sr-only" htmlFor="site-search-input">Search articles</label>
              <Input
                id="site-search-input"
                type="search"
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-navigation" className="border-t border-zinc-200 py-4 dark:border-zinc-800 xl:hidden">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              {NAVIGATION_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/about"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
