'use client';

import { useState } from 'react';
import CTABanner from '@/components/CTABanner';
import { socialLinks, orgInfo } from '@/lib/content';
import { capture } from '@/lib/analytics';
import { fireAdsConversion } from '@/lib/google-ads';
import { withUtm } from '@/lib/utm';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    website: '', // honeypot field
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'General Inquiry',
          message: formData.message,
          website: formData.website,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      setStatus('success');
      capture('inquiry_submitted', { subject: formData.subject || 'general' });
      fireAdsConversion('inquiry');
      setFormData({ name: '', email: '', subject: '', message: '', website: '' });
    } catch {
      setStatus('error');
      setErrorMessage('Failed to send message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Contact</span>{' '}
            <span className="font-black">US</span>
          </h1>
          <div className="w-12 h-[3px] bg-green-700 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">Get in touch with Garden State Abolitionists</p>
        </div>
      </section>

      {/* Contact-your-legislator CTA — kept above the fold so visitors
          looking to reach the government (not Garden State Abolitionists) find the right tool. */}
      <section className="bg-gray-50 py-6 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center text-sm">
          <span className="font-semibold text-gray-800">
            Contacting your legislators, not us?
          </span>{' '}
          <a href="/legislators" className="text-green-800 underline hover:no-underline">
            Find your state representative and senator on our scorecard &rarr;
          </a>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              <p className="text-gray-700 mb-6">
                We&apos;d love to hear from you. Whether you have questions, want to get involved, or need resources, please reach out.
              </p>

              <div className="space-y-4">
                {orgInfo.contactEmail && (
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href={`mailto:${orgInfo.contactEmail}`} className="text-green-700 hover:text-green-800">
                      {orgInfo.contactEmail}
                    </a>
                  </div>
                )}

                {socialLinks.signalGroup && (
                <div>
                  <h3 className="font-semibold mb-2">Join Our Signal Group</h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Connect with us and other abolitionists on Signal for real-time updates and discussion.
                  </p>
                  <a
                    href={withUtm(socialLinks.signalGroup, { source: 'contact_page', medium: 'invite', campaign: 'signal_group' })}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => capture('signal_group_clicked', { source: 'contact' })}
                    className="text-gray-600 hover:text-green-700 transition-colors inline-block"
                    aria-label="Join our Signal group"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.508.443a11.94 11.94 0 0 1 4.984 0l-.226 1.05a10.864 10.864 0 0 0-4.533 0L9.508.443zM6.05 1.83a11.967 11.967 0 0 1 4.317-1.78l.205 1.054a10.9 10.9 0 0 0-3.928 1.62L6.05 1.83zm11.9 0l-.594.894a10.9 10.9 0 0 0-3.928-1.62l.206-1.053A11.97 11.97 0 0 1 17.95 1.83zM1.83 6.05a11.97 11.97 0 0 1 3.165-3.165l.61.883A10.93 10.93 0 0 0 2.713 6.66l-.883-.61zm20.34 0l-.883.61a10.93 10.93 0 0 0-2.892-2.892l.61-.883a11.97 11.97 0 0 1 3.165 3.165zM.443 9.508a11.94 11.94 0 0 1 1.387-3.458l.928.55a10.88 10.88 0 0 0-1.262 3.144l-1.053-.236zm23.114 0l-1.053.236a10.88 10.88 0 0 0-1.262-3.143l.928-.551a11.94 11.94 0 0 1 1.387 3.458zM.005 11.748A11.97 11.97 0 0 1 .443 9.508l1.05.226a10.87 10.87 0 0 0-.4 2.038L.005 11.748zm23.55-2.24c.156.733.262 1.482.314 2.24l-1.078.024a10.87 10.87 0 0 0-.288-2.038l1.052-.226zM.005 12.252l1.078-.024c.052.69.149 1.372.288 2.038l-1.052.226a11.97 11.97 0 0 1-.314-2.24zm23.99 0a11.97 11.97 0 0 1-.438 2.24l-1.05-.226c.18-.66.316-1.34.4-2.038l1.088.024zM.443 14.492l1.053-.236c.265 1.094.692 2.149 1.262 3.143l-.928.551A11.94 11.94 0 0 1 .443 14.492zm23.114 0a11.94 11.94 0 0 1-1.387 3.458l-.928-.55c.57-.995.997-2.05 1.262-3.144l1.053.236zM1.83 17.95l.883-.61a10.93 10.93 0 0 0 2.892 2.892l-.61.883a11.97 11.97 0 0 1-3.165-3.165zm20.34 0a11.97 11.97 0 0 1-3.165 3.165l-.61-.883a10.93 10.93 0 0 0 2.892-2.892l.883.61zM6.05 22.17l.594-.894a10.9 10.9 0 0 0 3.928 1.62l-.206 1.053a11.97 11.97 0 0 1-4.316-1.78zm11.9 0a11.967 11.967 0 0 1-4.317 1.78l-.205-1.054a10.9 10.9 0 0 0 3.928-1.62l.594.894zM9.508 23.557a11.94 11.94 0 0 1-2.24-.438l.226-1.05c.66.18 1.34.316 2.038.4l-.024 1.088zm4.984 0l-.024-1.088a10.87 10.87 0 0 0 2.038-.4l.226 1.05a11.94 11.94 0 0 1-2.24.438zM12 6a6 6 0 0 0-5.318 8.778l-.798 2.667a.532.532 0 0 0 .67.67l2.668-.798A6 6 0 1 0 12 6z"/>
                    </svg>
                  </a>
                </div>
                )}

                {(socialLinks.facebook || socialLinks.x) && (
                <div>
                  <h3 className="font-semibold mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    {socialLinks.facebook && (
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-700 transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    )}
                    {socialLinks.x && (
                    <a
                      href={socialLinks.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-green-700 transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    )}
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-4" aria-describedby={status === 'error' ? 'contact-error' : status === 'success' ? 'contact-success' : undefined}>
                {/* Honeypot field - hidden from real users */}
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    autoComplete="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={254}
                    autoComplete="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="speaking">Speaking Request</option>
                    <option value="media">Media Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    maxLength={5000}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full px-6 py-3 bg-green-700 text-white font-bold hover:bg-green-800 transition-colors disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                <div aria-live="polite" aria-atomic="true">
                  {status === 'success' && (
                    <p id="contact-success" className="text-green-600 text-center" role="status">Message sent successfully!</p>
                  )}
                  {status === 'error' && (
                    <p id="contact-error" className="text-red-600 text-center" role="alert">{errorMessage}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}
