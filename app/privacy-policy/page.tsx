import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ResuMatch</p>
              <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
            </div>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">Last updated: August 29, 2026</p>

          <div className="space-y-6 text-sm leading-7 text-foreground/90">
            <p>
              ResuMatch ("we," "us," or "our") helps job seekers improve resumes and optimize
              them for role requirements. This Privacy Policy explains what information we collect,
              how it is used, and the choices available to you when you use ResuMatch.
            </p>

            <section>
              <h2 className="mb-3 text-xl font-semibold">1. Information we collect</h2>
              <p>We collect information needed to provide our service, including:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>
                  <span className="font-medium">Account information:</span> name, email address,
                  and profile details when you sign up or sign in with Google.
                </li>
                <li>
                  <span className="font-medium">Resume and analysis data:</span> uploaded resumes,
                  extracted text, job descriptions, skills, keywords, and generated recommendations.
                </li>
                <li>
                  <span className="font-medium">Usage data:</span> product usage activity, feature
                  interactions, and technical information used to improve performance and reliability.
                </li>
                <li>
                  <span className="font-medium">Subscription information:</span> if applicable,
                  billing status or plan information needed to manage access.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">2. How we use your information</h2>
              <p>We use your information to:</p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>create and maintain your account</li>
                <li>analyze your resume and compare it against job requirements</li>
                <li>generate ATS, keyword, and content improvement recommendations</li>
                <li>provide access to dashboard features and saved history</li>
                <li>support security, troubleshooting, and product improvement</li>
                <li>communicate important service updates, security notices, or account-related information</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">3. AI processing and third-party services</h2>
              <p>
                To provide resume insights and recommendations, we may send relevant content such as
                resume text and job requirements to third-party AI or processing services for analysis.
                We may also use third-party services for authentication, hosting, analytics, and
                related product operations. These providers process data only as needed to support the
                service and are subject to their own privacy terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">4. Data sharing</h2>
              <p>
                We do not sell personal information. We may share data with trusted service providers
                that help us operate ResuMatch, such as authentication providers, hosting providers,
                analytics tools, AI processing providers, and subscription/billing services when
                required to deliver the service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">5. Data retention</h2>
              <p>
                We retain personal information for as long as needed to provide the services, maintain
                accounts, comply with legal obligations, or resolve disputes. If you delete your
                account or request removal of your personal data, we will process that request in
                accordance with applicable law and platform capabilities.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">6. Your rights</h2>
              <p>
                Depending on your location, you may have rights to access, correct, restrict,
                delete, or object to the processing of your personal information. If you want to
                exercise those rights, contact us using the details at the end of this policy.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">7. Cookies and similar technologies</h2>
              <p>
                We may use cookies or similar technologies to keep you signed in, remember preferences,
                and understand how the app is used. You can manage cookies through your browser
                settings, although some features may not work correctly if cookies are disabled.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">8. Security</h2>
              <p>
                We use reasonable administrative, technical, and organizational safeguards to protect
                personal information. However, no system is completely secure, and we cannot guarantee
                absolute protection against all risks.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">9. Children</h2>
              <p>
                ResuMatch is not intended for children under the age of 16, and we do not knowingly
                collect personal information from children without appropriate parental consent or as
                required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">10. Changes to this policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise the
                "Last updated" date above. Continued use of the service after changes are posted means
                you accept the updated policy.
              </p>
            </section>

            {/* <section>
              <h2 className="mb-3 text-xl font-semibold">11. Contact us</h2>
              <p>
                If you have questions about this Privacy Policy or how your information is handled,
                please contact us at <a href="mailto:support@resumatch.app" className="text-accent underline">support@resumatch.app</a>.
              </p>
            </section> */}
          </div>
        </div>
      </div>
    </main>
  );
}
