import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { SITE_NAME, AUTHOR_EMAIL } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE_NAME} and our mission to provide high-quality development tutorials and resources.`,
};

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold">About {SITE_NAME}</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 dark:text-zinc-400">
                {SITE_NAME} is dedicated to providing comprehensive, production-grade
                tutorials and resources for modern web development. We focus on
                Next.js 16, React 19, TypeScript, and full-stack development
                patterns that developers can actually use in real-world projects.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  Our platform provides in-depth articles and tutorials covering:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Next.js 16 App Router architecture and best practices</li>
                  <li>React 19 features and modern patterns</li>
                  <li>TypeScript for production applications</li>
                  <li>Full-stack development with Supabase</li>
                  <li>AI application development</li>
                  <li>Performance optimization techniques</li>
                  <li>Security best practices</li>
                  <li>Production deployment strategies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  Unlike generic tutorials that copy documentation, we focus on:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Practical context:</strong> Articles explain the problem
                    a technique addresses and where its trade-offs matter
                  </li>
                  <li>
                    <strong>Careful examples:</strong> Code is educational and
                    should be reviewed and tested in your own application
                  </li>
                  <li>
                    <strong>Failure modes:</strong> Guides call out relevant
                    security, performance, and maintenance risks
                  </li>
                  <li>
                    <strong>Version awareness:</strong> Version-sensitive guidance
                    should be checked against current primary documentation
                  </li>
                  <li>
                    <strong>Performance focus:</strong> Optimization and best
                    practices are woven into every tutorial
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Why {SITE_NAME}?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  The web development landscape moves fast. Official documentation
                  is essential for reference, but it doesn&apos;t always explain how to
                  build real applications. That&apos;s where we come in.
                </p>
                <p>
                  We bridge the gap between documentation and production
                  development by adding context, examples, and implementation
                  trade-offs around the frameworks covered here. Author details
                  are published only after they are supplied by the site owner.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Editorial Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>Articles are intended to make technical topics easier to evaluate and apply:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Examples are explanatory, not a claim of production testing</li>
                  <li>Readers should verify version-specific APIs in official documentation</li>
                  <li>Security and performance implications should be considered before adoption</li>
                  <li>Outdated or incorrect information should be reported for review</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-zinc-600 dark:text-zinc-400">
                <p>
                  Have questions, suggestions, or want to contribute? We&apos;d love to
                  hear from you.
                </p>
                {AUTHOR_EMAIL && <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${AUTHOR_EMAIL}`} className="text-zinc-900 dark:text-zinc-50">
                    {AUTHOR_EMAIL}
                  </a>
                </p>}
                <p>
                  You can also reach out through our{' '}
                  <Link href="/contact" className="text-zinc-900 dark:text-zinc-50">
                    contact page
                  </Link>{' '}
                  for general inquiries or feedback.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
