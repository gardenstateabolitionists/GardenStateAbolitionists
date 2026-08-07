'use client';

import { useState } from 'react';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import { capture } from '@/lib/analytics';

export default function DeleteMyDataPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    details: '',
    website: '', // honeypot
  });
  const [dataTypes, setDataTypes] = useState({
    petition: false,
    inquiry: false,
    subscription: false,
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataTypes((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const selected = Object.entries(dataTypes)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (selected.length === 0) {
      setStatus('error');
      setErrorMessage('Please select at least one type of data to delete.');
      return;
    }

    const labels: Record<string, string> = {
      petition: 'Petition signature',
      inquiry: 'Contact inquiries',
      subscription: 'Email subscription',
    };

    const message = [
      'DATA DELETION REQUEST',
      '',
      `Data types requested for deletion: ${selected.map((k) => labels[k]).join(', ')}`,
      '',
      formData.details ? `Additional details: ${formData.details}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: 'Data Deletion Request',
          message,
          website: formData.website,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit request');
      }

      setStatus('success');
      capture('data_deletion_requested', {
        types: selected.join(','),
      });
      setFormData({ name: '', email: '', details: '', website: '' });
      setDataTypes({ petition: false, inquiry: false, subscription: false });
    } catch {
      setStatus('error');
      setErrorMessage('Failed to submit request. Please try again.');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Delete My</span>{' '}
            <span className="font-black">DATA</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Request removal of your personal information
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Your Data, Your Choice</h2>
            <p className="text-gray-700 mb-4">
              We respect your right to control your personal data. You may request deletion of any
              personal information we hold about you, including petition signatures, contact inquiries,
              and email subscriptions.
            </p>
            <p className="text-gray-700 mb-4">
              Once we receive your request, we will verify your identity using the email address provided
              and process your deletion within 30 days. You will receive an email confirmation when your
              data has been removed.
            </p>
            <p className="text-gray-700">
              For more information about how we handle your data, please see our{' '}
              <Link href="/privacy-policy" className="text-red-700 underline hover:no-underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-xl font-bold text-green-800 mb-2">Request Submitted</h3>
              <p className="text-green-700">
                We have received your data deletion request. We will verify your identity and process
                the deletion within 30 days. You will receive an email confirmation at the address provided.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
              <div className="absolute opacity-0 top-0 left-0 h-0 w-0 -z-10" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="del-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="del-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="del-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  Must match the email used when you signed the petition or contacted us.
                </p>
                <input
                  type="email"
                  id="del-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={254}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">
                  What data would you like deleted? *
                </legend>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="petition"
                      checked={dataTypes.petition}
                      onChange={handleCheckbox}
                      className="mt-0.5 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Petition Signature</span>
                      <p className="text-xs text-gray-500">Your name, email, city, state, and zip code from the petition.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="inquiry"
                      checked={dataTypes.inquiry}
                      onChange={handleCheckbox}
                      className="mt-0.5 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Contact Inquiries</span>
                      <p className="text-xs text-gray-500">Any messages you sent through our contact form.</p>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="subscription"
                      checked={dataTypes.subscription}
                      onChange={handleCheckbox}
                      className="mt-0.5 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Email Subscription</span>
                      <p className="text-xs text-gray-500">Remove your email from our mailing list.</p>
                    </div>
                  </label>
                </div>
              </fieldset>

              <div>
                <label htmlFor="del-details" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details (optional)
                </label>
                <textarea
                  id="del-details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={3}
                  maxLength={2000}
                  placeholder="Any additional context about your request..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-6 py-3 bg-red-600 text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? 'Submitting...' : 'Submit Deletion Request'}
              </button>

              <div aria-live="polite" aria-atomic="true">
                {status === 'error' && (
                  <p className="text-red-600 text-center" role="alert">{errorMessage}</p>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
