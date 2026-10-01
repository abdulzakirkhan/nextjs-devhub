'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { AUTHOR_EMAIL, SITE_NAME } from '@/lib/constants';

export default function ContactPage() {
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitMessage, setSubmitMessage] = React.useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('Newsletter signup is not connected. Your email was not stored or sent.');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('Message delivery is not configured. Your message was not stored or sent.');
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold">Contact Us</h1>
          <p className="mb-12 text-lg text-zinc-600 dark:text-zinc-400">
            Contact {SITE_NAME} with questions, feedback, or collaboration inquiries.
          </p>

          <p className="mb-8 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            Contact and newsletter forms are not connected to a delivery service. Submitting a form will not send or store its contents.
          </p>

          {submitMessage && (
            <div role="alert" className="mb-8 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
              {submitMessage}
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            {/* Newsletter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Subscribe to Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                  Newsletter signup is not connected. No email address is stored or sent.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <Input
                    type="email"
                    aria-label="Email address for newsletter signup"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Send a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    type="text"
                    aria-label="Your name"
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="email"
                    aria-label="Your email address"
                    placeholder="Your email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    type="text"
                    aria-label="Message subject"
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, subject: e.target.value })
                    }
                    required
                  />
                  <textarea
                    aria-label="Your message"
                    className="flex min-h-[120px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                    placeholder="Your message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full"
                  >
                    Send Message <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Direct Contact */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Direct Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-zinc-600 dark:text-zinc-400">
                <p>
                  For direct inquiries, you can also email us at:
                </p>
                {AUTHOR_EMAIL ? <p>
                  <a
                    href={`mailto:${AUTHOR_EMAIL}`}
                    className="font-medium text-zinc-900 dark:text-zinc-50"
                  >
                    {AUTHOR_EMAIL}
                  </a>
                </p> : <p>Direct contact is not configured. Set CONTACT_EMAIL before publishing.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
