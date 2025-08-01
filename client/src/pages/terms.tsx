import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

export default function Terms() {
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
          
          <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">VenomGPT Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate prose-invert max-w-none">
            <div className="space-y-6 text-slate-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using VenomGPT, you accept and agree to be bound by the terms and provision of this agreement.
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
                <p>
                  VenomGPT is an AI-powered chatbot service that provides conversational AI assistance. The service is powered by
                  Cerebras AI infrastructure and aims to provide uncensored, high-performance AI interactions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. User Responsibilities</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                  <li>You agree not to use the service for illegal activities or to violate any laws</li>
                  <li>You will not attempt to reverse engineer, hack, or compromise the service</li>
                  <li>You will respect the intellectual property rights of others</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. Content Policy</h2>
                <p>
                  While VenomGPT aims to provide uncensored AI interactions, users are still responsible for their own content
                  and interactions. We reserve the right to terminate accounts that engage in illegal activities or harassment.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. Privacy</h2>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service,
                  to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">6. Disclaimers</h2>
                <p>
                  The service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness,
                  or usefulness of any information provided by the AI system.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
                <p>
                  In no event shall VenomGPT be liable for any direct, indirect, incidental, special, consequential, or punitive
                  damages resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">8. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting
                  to the website. Your continued use of the service constitutes acceptance of any changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-3">9. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us through our support channels.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
