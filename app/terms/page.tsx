import Link from "next/link";
import { ArrowLeft, ScrollText } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ScrollText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ResuMatch</p>
              <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
            </div>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">Last updated: August 29, 2026</p>

          <div className="space-y-6 text-sm leading-7 text-foreground/90">
            <p>
              These Terms of Service ("Terms") govern your access to and use of ResuMatch. By
              creating an account or using the service, you agree to these Terms. If you do not agree,
              do not use ResuMatch.
            </p>

            <section>
              <h2 className="mb-3 text-xl font-semibold">1. The service</h2>
              <p>
                ResuMatch provides resume analysis, ATS optimization, keyword recommendations, and
                related career-support tools. We may change, suspend, or discontinue any part of the
                service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">2. Your account</h2>
              <p>
                You are responsible for the security of your account and for all activity that occurs
                under it. You agree to provide accurate information and to keep your login details
                secure. You must be at least 16 years old to use ResuMatch.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">3. Acceptable use</h2>
              <p>You agree not to misuse the service. In particular, you may not:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>upload content you do not have the right to use</li>
                <li>submit false, misleading, or unlawful information</li>
                <li>attempt unauthorized access, reverse engineering, or service disruption</li>
                <li>use the platform for abusive, discriminatory, or unlawful activity</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">4. AI-generated recommendations</h2>
              <p>
                ResuMatch uses AI to analyze resumes and provide recommendations. AI output may be
                incomplete, inaccurate, or generic. You are responsible for reviewing, editing, and
                validating any content before using it in applications or professional contexts. We do
                not guarantee any particular job outcome, interview result, or employment success.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">5. Your content</h2>
              <p>
                You retain ownership of the resumes, job details, and content you upload. By using the
                service, you grant us the rights necessary to process, store, analyze, and generate
                recommendations from that content for the purpose of delivering ResuMatch features.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">6. Subscription and billing</h2>
              <p>
                If a paid plan is available, pricing and billing terms are presented in the app at the
                time of purchase. Subscription charges, renewal, and cancellation terms are governed by
                the applicable plan details and payment provider terms. Unless required by law,
                payments are generally non-refundable.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">7. Third-party services</h2>
              <p>
                ResuMatch may rely on third-party providers for authentication, hosting, analytics,
                AI processing, and related operational services. Your use of the service may also be
                subject to those providers' terms. We are not responsible for external content or
                services that you choose to submit or access through the platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">8. Availability and disclaimers</h2>
              <p>
                ResuMatch is provided on an "as is" basis. We do not warrant that the service will be
                uninterrupted, error-free, or suitable for your specific goals. To the fullest extent
                permitted by law, we disclaim warranties of any kind, whether express or implied.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">9. Limitation of liability</h2>
              <p>
                We are not liable for indirect, incidental, consequential, special, or punitive
                damages arising from or related to your use of ResuMatch, including loss of business,
                reputation, or opportunity, except to the extent required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">10. Termination</h2>
              <p>
                We may suspend or terminate your access to ResuMatch if you violate these Terms or if
                we need to discontinue the service. You may stop using the service and request account
                deletion at any time.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">11. Changes to these Terms</h2>
              <p>
                We may update these Terms from time to time. When we do, we will revise the "Last
                updated" date above. Continued use of the service after updates means you accept the
                revised Terms.
              </p>
            </section>

            {/* <section>
              <h2 className="mb-3 text-xl font-semibold">12. Contact</h2>
              <p>
                If you have questions about these Terms, contact us at <a href="mailto:support@resumatch.app" className="text-accent underline">support@resumatch.app</a>.
              </p>
            </section> */}
          </div>
        </div>
      </div>
    </main>
  );
}
