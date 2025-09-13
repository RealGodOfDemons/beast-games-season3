// src/pages/PrivacyPolicy.tsx


export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">🔐 Privacy Policy - MrBeast Giveaway</h1>
        <p className="text-center text-gray-400">
          <strong>Effective Date:</strong> July 19, 2025
        </p>

        {/* Section 1 */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">1. Information We Collect</h2>
          <p>
            We collect both <strong>personal</strong> and <strong>non-personal</strong> information,
            including:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Full Name</li>
            <li>Email Address</li>
            <li>Card Details (secured through encryption and third-party processors)</li>
            <li>IP Address</li>
            <li>Browser and Device Information</li>
            <li>Payment and Transaction Info</li>
          </ul>
          <p>
            <strong>We do not store</strong> your full card number or CVV. All payments are securely
            processed.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Process giveaway entries</li>
            <li>Accept and confirm payments</li>
            <li>Prevent fraud and abuse</li>
            <li>Send updates and notifications</li>
            <li>Improve site performance and user experience</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">3. Data Sharing</h2>
          <p>We <strong>do not sell</strong> your information.</p>
          <p>We only share your data with:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Payment processors (e.g., Paystack, Flutterwave)</li>
            <li>Giveaway auditors (if applicable)</li>
            <li>Law enforcement if legally required</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">4. Cookies & Tracking</h2>
          <p>
            We may use cookies and analytics to understand usage and improve our services. You can
            disable cookies in your browser settings.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">5. Security</h2>
          <p>We protect your data with:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>SSL encryption</li>
            <li>Secure payment gateways</li>
            <li>Server-level firewalls</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">6. Children’s Privacy</h2>
          <p>
            This site is <strong>not intended for users under the age of 13</strong>. Do not provide
            personal info if under 13.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Access your personal data</li>
            <li>Request deletion of your information</li>
            <li>Opt out of marketing emails</li>
          </ul>
          <p>Contact us to exercise any of these rights.</p>
        </section>

        {/* Section 8 */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">8. Policy Updates</h2>
          <p>
            This policy may be updated. We will post changes on this page with a new effective date.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">9. Contact Us</h2>
          <p>Have questions? Reach out:</p>
          <p>
            📧{" "}
            <a
              href="mailto:support@mrbeastgiveaway.com"
              className="text-blue-400 hover:underline"
            >
              support@mrbeastgiveaway.com
            </a>
          </p>
          <p>📞 +15485784962 (WhatsApp only)</p>
        </section>
      </div>
    </div>
  );
}
