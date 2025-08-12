import React, { useState } from 'react';
import { Mail, Send, Sparkles, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [recipients, setRecipients] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState({ subject: '', body: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const generateEmail = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for the email');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/generate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate email');
      }

      setGeneratedEmail(data);
    } catch (err) {
      setError(`Failed to generate email: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!recipients.trim()) {
      setError('Please enter at least one recipient email address');
      return;
    }

    if (!generatedEmail.subject || !generatedEmail.body) {
      setError('Please generate an email first');
      return;
    }

    setIsSending(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipients,
          subject: generatedEmail.subject,
          body: generatedEmail.body,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSuccess(data.message);
      // Clear form after successful send
      setRecipients('');
      setPrompt('');
      setGeneratedEmail({ subject: '', body: '' });
    } catch (err) {
      setError(`Failed to send email: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full mr-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">AI Email Sender</h1>
          </div>
          <p className="text-gray-600 text-lg">Generate professional emails with AI and send them instantly</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                <p className="text-green-700">{success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Input Form */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="recipients" className="block text-sm font-semibold text-gray-700 mb-2">
                    Recipients (comma-separated)
                  </label>
                  <input
                    id="recipients"
                    type="text"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    placeholder="john@example.com, jane@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="prompt" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the email you want to generate. For example: 'Write a professional follow-up email for a job interview thanking the interviewer and expressing continued interest in the position.'"
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  onClick={generateEmail}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Email
                    </>
                  )}
                </button>
              </div>

              {/* Right Column - Generated Email */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject Line
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={generatedEmail.subject}
                    onChange={(e) => setGeneratedEmail(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Email subject will appear here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="body" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Body (Editable)
                  </label>
                  <textarea
                    id="body"
                    value={generatedEmail.body}
                    onChange={(e) => setGeneratedEmail(prev => ({ ...prev, body: e.target.value }))}
                    placeholder="Generated email content will appear here. You can edit it before sending."
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>

                <button
                  onClick={sendEmail}
                  disabled={isSending || !recipients.trim() || !generatedEmail.body.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">How to use:</h3>
            <ol className="list-decimal list-inside space-y-2 text-blue-700">
              <li>Enter recipient email addresses (comma-separated)</li>
              <li>Describe the email you want to generate in the prompt field</li>
              <li>Click "Generate Email" to create AI-powered content</li>
              <li>Review and edit the generated email if needed</li>
              <li>Click "Send Email" to deliver the email to recipients</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> To send emails, you need to configure your Gmail credentials in the server's .env file.
                Update EMAIL_USER and EMAIL_PASS with your Gmail address and app password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;