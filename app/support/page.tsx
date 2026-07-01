import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Mail, MessageCircle, Book, HelpCircle } from 'lucide-react'

export default function SupportPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Support</h1>
          <p className="text-lg text-gray-600 mb-8">
            We're here to help! Get assistance with Ascension Fasting.
          </p>

          <div className="space-y-6">
            {/* Contact Support */}
            <section className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Contact Support</h2>
                  <p className="text-gray-700 mb-4">
                    Have a question or need help? Email our support team and we'll get back to you within 24-48 hours.
                  </p>
                  <a 
                    href="mailto:support@ascensionfasting.com"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    support@ascensionfasting.com
                  </a>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">How do I start a fast?</h3>
                      <p className="text-gray-700 text-sm">
                        Go to the Fast page, select your fast type (water, juice, or intermittent), 
                        choose your duration, and tap "Start Fast". Your timer will begin immediately.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Can I edit my weight entries?</h3>
                      <p className="text-gray-700 text-sm">
                        Currently, weight entries cannot be edited after submission. If you made an error, 
                        please contact support and we can help correct it.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Is fasting safe for me?</h3>
                      <p className="text-gray-700 text-sm">
                        Ascension Fasting does not provide medical advice. Please consult with a qualified 
                        healthcare professional before beginning any fasting program, especially if you have 
                        medical conditions, are pregnant, under 18, or taking medication.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">How do I delete my account?</h3>
                      <p className="text-gray-700 text-sm">
                        Go to Profile → Account Actions → Delete Account. You can also visit our{' '}
                        <Link href="/delete-account" className="text-blue-600 hover:underline">
                          account deletion page
                        </Link>.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">What data do you collect?</h3>
                      <p className="text-gray-700 text-sm">
                        We collect your email, profile information, fasting history, weight entries, and 
                        achievement data. See our{' '}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>{' '}
                        for complete details.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">How do achievements work?</h3>
                      <p className="text-gray-700 text-sm">
                        Achievements are automatically unlocked as you complete fasts and reach milestones. 
                        Check the Achievements page to see your progress and available achievements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Feature Requests */}
            <section className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Feature Requests & Feedback</h2>
                  <p className="text-gray-700 mb-4">
                    Have an idea for a new feature or want to share feedback? We'd love to hear from you!
                  </p>
                  <a 
                    href="mailto:feedback@ascensionfasting.com"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    feedback@ascensionfasting.com
                  </a>
                </div>
              </div>
            </section>

            {/* Documentation */}
            <section className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Book className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Important Links</h2>
                  <div className="space-y-2">
                    <div>
                      <Link href="/privacy" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </div>
                    <div>
                      <Link href="/terms" className="text-blue-600 hover:underline">
                        Terms of Service
                      </Link>
                    </div>
                    <div>
                      <Link href="/delete-account" className="text-blue-600 hover:underline">
                        Delete Account
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
