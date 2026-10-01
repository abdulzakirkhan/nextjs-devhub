import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SITE_NAME, AUTHOR_EMAIL } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: `Terms & Conditions for ${SITE_NAME}. Read our terms of service and usage guidelines.`,
};

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold">Terms & Conditions</h1>
          <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <Card>
            <CardContent className="p-6">
              <div className="prose prose-zinc max-w-none dark:prose-invert">
                <p>
                  Welcome to {SITE_NAME}. By accessing and using this website,
                  you agree to comply with and be bound by the following Terms
                  & Conditions.
                </p>

                <Separator className="my-6" />

                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing this website, you accept these Terms & Conditions
                  in full. If you do not accept these Terms & Conditions, you
                  must not use this website.
                </p>

                <Separator className="my-6" />

                <h2>2. Intellectual Property</h2>
                <p>
                  All content on this website, including text, graphics, logos,
                  images, and software, is the property of {SITE_NAME} or its
                  content suppliers and is protected by international copyright
                  laws.
                </p>

                <Separator className="my-6" />

                <h2>3. Use License</h2>
                <p>
                  Permission is granted to temporarily download one copy of the
                  materials on this website for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a
                  transfer of title.
                </p>

                <Separator className="my-6" />

                <h2>4. User Obligations</h2>
                <p>As a user of this website, you agree to:</p>
                <ul>
                  <li>Use the website for lawful purposes only</li>
                  <li>Not reproduce, duplicate, or copy content without permission</li>
                  <li>Not use the website to distribute malicious software</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Not interfere with the proper working of the website</li>
                </ul>

                <Separator className="my-6" />

                <h2>5. Content Accuracy</h2>
                <p>
                  The materials on this website are provided on an &apos;as is&apos; basis.
                  We make no warranties, expressed or implied, and hereby
                  disclaim all warranties regarding the accuracy or reliability
                  of the materials.
                </p>

                <Separator className="my-6" />

                <h2>6. Limitation of Liability</h2>
                <p>
                  In no event shall {SITE_NAME} or its suppliers be liable for
                  any damages arising out of the use or inability to use the
                  materials on this website, even if advised of the possibility
                  of such damages.
                </p>

                <Separator className="my-6" />

                <h2>7. External Links</h2>
                <p>
                  This website may contain links to third-party websites. We are
                  not responsible for the content or privacy practices of these
                  external sites. Inclusion of any links does not imply
                  endorsement.
                </p>

                <Separator className="my-6" />

                <h2>8. Privacy Policy</h2>
                <p>
                  Your use of this website is also governed by our Privacy
                  Policy. Please review our Privacy Policy, which also governs
                  the website and informs users of our data collection practices.
                </p>

                <Separator className="my-6" />

                <h2>9. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless {SITE_NAME} from any
                  claims, damages, or expenses arising from your use of the
                  website or violation of these Terms & Conditions.
                </p>

                <Separator className="my-6" />

                <h2>10. Modifications</h2>
                <p>
                  {SITE_NAME} may revise these Terms & Conditions at any time
                  without notice. By using this website, you are agreeing to be
                  bound by the then current version of these Terms & Conditions.
                </p>

                <Separator className="my-6" />

                <h2>11. Governing Law</h2>
                <p>
                  Configure this section with the jurisdiction and applicable
                  law selected by the site owner before publication. No location
                  or governing jurisdiction has been supplied for {SITE_NAME}.
                </p>

                <Separator className="my-6" />

                <h2>12. Contact Information</h2>
                <p>
                  If you have any questions about these Terms & Conditions,
                  please contact us at:
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  {AUTHOR_EMAIL ? <a href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a> : 'Set CONTACT_EMAIL before publishing these terms.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
