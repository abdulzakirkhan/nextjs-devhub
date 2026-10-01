import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SITE_NAME, AUTHOR_EMAIL } from '@/lib/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: `Disclaimer for ${SITE_NAME}. Important information about the content and accuracy of our articles.`,
};

export default function DisclaimerPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-4xl font-bold">Disclaimer</h1>
          <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <Card>
            <CardContent className="p-6">
              <div className="prose prose-zinc max-w-none dark:prose-invert">
                <p>
                  The information provided on {SITE_NAME} is for educational and
                  informational purposes only. All information on this site is
                  provided in good faith, however, we make no representation or
                  warranty of any kind regarding the accuracy, validity,
                  reliability, or completeness of any information on this site.
                </p>

                <Separator className="my-6" />

                <h2>1. Educational Content Only</h2>
                <p>
                  The articles, tutorials, and guides on this website are
                  intended for educational purposes. They are not a substitute
                  for professional advice, whether technical, legal, financial,
                  or otherwise.
                </p>

                <Separator className="my-6" />

                <h2>2. Accuracy of Information</h2>
                <p>
                  While we strive to keep the information up-to-date and
                  correct, we make no representations about the completeness or
                  accuracy of any information on this site. The technology
                  landscape changes rapidly, and information may become outdated.
                </p>

                <Separator className="my-6" />

                <h2>3. No Professional Advice</h2>
                <p>
                  The content on this website does not constitute professional
                  advice. You should not rely on the information as a substitute
                  for professional advice from a qualified professional in the
                  relevant field.
                </p>

                <Separator className="my-6" />

                <h2>4. Use at Your Own Risk</h2>
                <p>
                  Any reliance you place on such information is therefore
                  strictly at your own risk. In no event will we be liable for
                  any loss or damage including without limitation, indirect or
                  consequential loss or damage, or any loss or damage whatsoever
                  arising from loss of data or profits arising out of, or in
                  connection with, the use of this website.
                </p>

                <Separator className="my-6" />

                <h2>5. Technical Implementation</h2>
                <p>
                  Code examples and technical solutions provided on this website
                  are for demonstration purposes. You should thoroughly test any
                  code in your own environment before using it in production.
                  We are not responsible for any issues that may arise from
                  implementing code or solutions from this website.
                </p>

                <Separator className="my-6" />

                <h2>6. External Links</h2>
                <p>
                  Through this website you may be able to link to other websites
                  which are not under the control of {SITE_NAME}. We have no
                  control over the nature, content, and availability of those
                  sites. The inclusion of any links does not necessarily imply
                  a recommendation or endorse the views expressed within them.
                </p>

                <Separator className="my-6" />

                <h2>7. Third-Party Products and Services</h2>
                <p>
                  References to third-party products, services, or tools on this
                  website do not constitute endorsement or recommendation. You
                  should conduct your own research and due diligence before
                  using any third-party products or services.
                </p>

                <Separator className="my-6" />

                <h2>8. Changes to Technology</h2>
                <p>
                  Software frameworks, libraries, and technologies mentioned on
                  this website are subject to change. Version updates,
                  deprecations, and breaking changes may occur that affect the
                  accuracy of our content.
                </p>

                <Separator className="my-6" />

                <h2>9. Professional Development</h2>
                <p>
                  This website aims to help developers learn and improve their
                  skills. However, reading articles on this site does not
                  guarantee employment, certification, or professional competency.
                </p>

                <Separator className="my-6" />

                <h2>10. Changes to This Disclaimer</h2>
                <p>
                  We reserve the right to modify this disclaimer at any time.
                  Changes will be effective immediately upon posting to the
                  website. Your continued use of the site following the posting
                  of changes constitutes your acceptance of such changes.
                </p>

                <Separator className="my-6" />

                <h2>11. Contact Us</h2>
                <p>
                  If you have any questions about this disclaimer, please
                  contact us at:
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  {AUTHOR_EMAIL ? <a href={`mailto:${AUTHOR_EMAIL}`}>{AUTHOR_EMAIL}</a> : 'Set CONTACT_EMAIL before publishing this disclaimer.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
