import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { SOCIAL_LINKS, NAVIGATION_CATEGORIES } from '@/lib/constants';

export function Footer() {
  const socialLinks = [
    { label: 'X', href: SOCIAL_LINKS.twitter },
    { label: 'GitHub', href: SOCIAL_LINKS.github },
    { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin },
    { label: 'YouTube', href: SOCIAL_LINKS.youtube },
  ].filter((social) => social.href);

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                <span className="text-lg font-bold">N</span>
              </div>
              <span className="font-bold">Next.js DevHub</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              A comprehensive resource for Next.js 16, React 19, TypeScript, and
              full-stack development.
            </p>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 font-semibold">Categories</h3>
            <ul className="space-y-2">
              {NAVIGATION_CATEGORIES.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/author/site-author"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Author
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            © {new Date().getFullYear()} Next.js DevHub. All rights reserved.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Built with Next.js 16, React 19, and Tailwind CSS v4
          </p>
        </div>
      </div>
    </footer>
  );
}
