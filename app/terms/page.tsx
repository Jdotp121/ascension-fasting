import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 lg:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-600 mb-8">Last Updated: June 26, 2026</p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using Ascension Fasting (&quot;the App&quot;), you accept and agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use the App.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                Ascension Fasting is a wellness tracking application that allows users to track fasting periods, 
                monitor weight, and view achievement progress. The App is intended for general wellness purposes 
                only and does not provide medical advice, diagnosis, or treatment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Health Disclaimer</h2>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
                <p className="text-amber-900 font-semibold mb-2">IMPORTANT HEALTH NOTICE:</p>
                <p className="text-amber-800 leading-relaxed">
                  Ascension Fasting is for general wellness tracking only and does not provide medical advice, 
                  diagnosis, or treatment. Fasting may not be suitable for everyone. You should consult with a 
                  qualified healthcare professional before beginning any fasting program, especially if you:
                </p>
                <ul className="list-disc pl-6 text-amber-800 mt-2 space-y-1">
                  <li>Have any medical conditions (diabetes, eating disorders, heart conditions, etc.)</li>
                  <li>Are pregnant or breastfeeding</li>
                  <li>Are under 18 years of age</li>
                  <li>Are taking any medications</li>
                  <li>Have a history of eating disorders</li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                By using this App, you acknowledge that you understand these risks and take full responsibility 
                for your health and any fasting activities you undertake.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                To use certain features of the App, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
                <li>Be at least 18 years of age</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Acceptable Use</h2>
              <p className="text-gray-700 leading-relaxed mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Use the App for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the App&apos;s functionality</li>
                <li>Upload malicious code or harmful content</li>
                <li>Misrepresent your identity or affiliation</li>
                <li>Use the App to provide medical advice to others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All content, features, and functionality of the App are owned by Ascension Fasting and are 
                protected by international copyright, trademark, and other intellectual property laws. You 
                may not copy, modify, distribute, or reverse engineer any part of the App without our express 
                written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. User Data and Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Your use of the App is also governed by our Privacy Policy. By using the App, you consent to 
                the collection and use of your information as described in our{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed">
                THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
                OR IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF 
                VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ASCENSION FASTING SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO HEALTH 
                COMPLICATIONS, WEIGHT CHANGES, OR ANY OTHER DAMAGES ARISING FROM YOUR USE OF THE APP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Account Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violations of these 
                Terms. You may delete your account at any time through the Profile section of the App or by 
                contacting us at{' '}
                <a href="mailto:support@ascensionfasting.com" className="text-blue-600 hover:underline">
                  support@ascensionfasting.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We may modify these Terms at any time. We will notify users of any material changes by updating 
                the &quot;Last Updated&quot; date. Your continued use of the App after such changes constitutes acceptance 
                of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                in which Ascension Fasting operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">13. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-700 font-medium mt-2">
                Email: <a href="mailto:legal@ascensionfasting.com" className="text-blue-600 hover:underline">legal@ascensionfasting.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
