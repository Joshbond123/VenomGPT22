import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-slate-600 hover:border-slate-500 text-slate-300 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">VenomGPT Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
                <p>
                  When you use VenomGPT, we may collect the following types of information:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li><strong>Account Information:</strong> When you register, we collect your username, email address, and encrypted password</li>
                  <li><strong>Chat Data:</strong> Your conversations with the AI are stored locally to provide chat history functionality</li>
                  <li><strong>Usage Information:</strong> We may collect information about how you use our service for improvement purposes</li>
                  <li><strong>Technical Information:</strong> Basic technical information such as IP addresses and browser information for security purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Provide and maintain the VenomGPT service</li>
                  <li>Enable you to access your chat history and personalized features</li>
                  <li>Improve our AI models and service quality</li>
                  <li>Protect against fraud and ensure security</li>
                  <li>Communicate with you about service updates</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. Data Storage and Security</h2>
                <p>
                  Your data is stored locally on our servers and is not shared with third parties except as described in this policy.
                  We implement appropriate security measures to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Encrypted password storage using industry-standard hashing</li>
                  <li>Secure server infrastructure and access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal data on a need-to-know basis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. AI and Third-Party Services</h2>
                <p>
                  VenomGPT uses Cerebras AI infrastructure to power our conversational AI. When you interact with our AI:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Your messages are processed by Cerebras AI systems to generate responses</li>
                  <li>We use summarization techniques to maintain conversation context efficiently</li>
                  <li>We do not share your personal information with AI providers beyond what's necessary for service operation</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. Anonymous Usage</h2>
                <p>
                  You can use VenomGPT without creating an account. For anonymous users:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Chat history is not saved</li>
                  <li>No personal information is collected</li>
                  <li>Sessions are temporary and data is not retained after you leave</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention</h2>
                <p>
                  We retain your information for as long as necessary to provide our services. You can delete your account
                  and associated data at any time by contacting us. Chat history can be deleted through the interface or
                  upon account deletion.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your chat history</li>
                  <li>Opt out of data collection by using the service anonymously</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">8. Cookies and Tracking</h2>
                <p>
                  We use essential cookies to maintain your session and provide core functionality. We do not use
                  tracking cookies or third-party analytics tools that compromise your privacy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">9. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by
                  posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us through
                  our support channels or by using the contact information provided in our Terms of Service.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
