import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SITE_NAME, AUTHOR_EMAIL } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your personal information.`,
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
          <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <Card>
            <CardContent className="p-6">
              <div className="prose prose-zinc max-w-none dark:prose-invert">
                <p>
                  Welcome to {SITE_NAME}. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when
                  you visit our website.
                </p>

                <Separator className="my-6" />

                <h2>1. Information We Collect</h2>
                <p>
                  This site currently has no account system, connected newsletter provider, contact-delivery backend, analytics provider, or advertising network. The contact forms do not send or store submitted values. The hosting provider may process standard request and security logs.
                </p>
                <ul>
                  <li>
                    <strong>Operational logs:</strong> The hosting provider may
                    process request metadata such as IP address, browser type,
                    and requested paths for delivery and security.
                  </li>
                  <li>
                    <strong>Theme preference:</strong> The theme control stores
                    a preference in browser storage on your device.
                  </li>
                </ul>

                <Separator className="my-6" />

                <h2>2. How We Use Your Information</h2>
                <p>Operational data may be used to deliver the site, prevent abuse, and diagnose service errors. No newsletter or analytics processing is configured at this time.</p>
                <ul>
                  <li>To provide and secure the website</li>
                  <li>To respond when you contact the configured email address directly</li>
                  <li>To meet applicable legal obligations</li>
                </ul>

                <Separator className="my-6" />

                <h2>3. Information Sharing</h2>
                <p>
                  The site does not currently operate a system for collecting or selling visitor profiles. Data may be processed by the hosting provider to operate the service and by third-party sites you choose to visit.
                </p>
                <ul>
                  <li>
                    By hosting and infrastructure providers that deliver the site
                  </li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>

                <Separator className="my-6" />

                <h2>4. Third-Party Services</h2>
                <p>
                  Our website may contain links to third-party websites or
                  services. We are not responsible for the privacy practices of
                  these third parties. We encourage you to review their privacy
                  policies.
                </p>

                <Separator className="my-6" />

                <h2>5. Cookies and Tracking</h2>
                <p>
                  No analytics or advertising cookies are configured. The theme preference is stored in browser storage. If analytics, advertising, or a newsletter service is added, this policy and any required consent controls must be updated before launch.
                </p>

                <Separator className="my-6" />

                <h2>6. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction. However, no method of transmission
                  over the internet is 100% secure.
                </p>

                <Separator className="my-6" />

                <h2>7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
                <p>
                  To exercise these rights, please contact us{AUTHOR_EMAIL ? <> at{' '}
                    <a href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a></> : ' using the contact details configured by the site owner'}.
                </p>

                <Separator className="my-6" />

                <h2>8. Children&apos;s Privacy</h2>
                <p>
                  Our website is not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13.
                </p>

                <Separator className="my-6" />

                <h2>9. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page.
                </p>

                <Separator className="my-6" />

                <h2>10. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  {AUTHOR_EMAIL ? <a href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a> : 'Set CONTACT_EMAIL before publishing this policy.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
