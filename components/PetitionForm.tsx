'use client';

import { useState, useEffect } from 'react';
import { signPetition, getPublicSignatureCount } from '@/lib/actions/petition-actions';
import { capture } from '@/lib/analytics';
import { fireAdsConversion } from '@/lib/google-ads';

export default function PetitionForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    state: 'NJ',
    zipcode: '',
    subscribed: true,
    website: '', // honeypot field
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [signatureCount, setSignatureCount] = useState(0);

  useEffect(() => {
    // Fetch signature count on load
    getPublicSignatureCount().then(setSignatureCount);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setStatus('submitting');
    setErrorMessage('');

    try {
      const result = await signPetition(formData);

      if ('error' in result) {
        setStatus('error');
        setErrorMessage(result.error);
      } else {
        setStatus('success');
        setSignatureCount((prev) => prev + 1);
        capture('petition_signed', {
          state: formData.state,
          subscribed: formData.subscribed,
        });
        fireAdsConversion('petition');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setFormData({
          name: '',
          email: '',
          city: '',
          state: 'NJ',
          zipcode: '',
          subscribed: true,
          website: '',
        });
      }
    } catch {
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border-2 border-green-600 p-8 rounded-lg text-center" id="sign" role="status" aria-live="polite">
        <div className="text-green-600 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-green-800">Thank You for Signing!</h3>
        <p className="text-gray-700 mb-4">
          Your signature has been added to the petition. Together, we are standing for the right to life of every preborn child in New Jersey.
        </p>
        <p className="text-lg font-semibold text-green-700">
          {signatureCount.toLocaleString()} {signatureCount === 1 ? 'person has' : 'people have'} signed this petition
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-green-600 hover:text-green-700 underline"
        >
          Sign another person
        </button>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-2 border-red-600 p-8 rounded-lg" id="sign">
      <h3 className="text-2xl font-bold mb-2 text-center">Sign the Petition</h3>

      {signatureCount > 0 && (
        <p className="text-center text-gray-600 mb-4">
          <span className="font-semibold text-red-700">{signatureCount.toLocaleString()}</span> {signatureCount === 1 ? 'person has' : 'people have'} already signed
        </p>
      )}

      <p className="text-gray-700 mb-6 text-center">
        Add your name to the growing list of New Jerseyans calling for the immediate abolition of abortion.
      </p>

      <div aria-live="polite" aria-atomic="true">
        {status === 'error' && (
          <div id="petition-error" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            {errorMessage}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" aria-describedby={status === 'error' ? 'petition-error' : undefined}>
        {/* Honeypot field - hidden from real users */}
        <div className="absolute opacity-0 top-0 left-0 h-0 w-0 -z-10" aria-hidden="true">
          <label htmlFor="pet-website">Website</label>
          <input
            type="text"
            id="pet-website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
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
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Your full name"
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
              autoComplete="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              autoComplete="address-level2"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Your city"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="NJ">New Jersey</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
              Zip Code
            </label>
            <input
              type="text"
              id="zipcode"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              autoComplete="postal-code"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="12345"
              maxLength={10}
            />
          </div>
        </div>

        {/* Email Subscription Checkbox */}
        <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
          <input
            type="checkbox"
            id="subscribed"
            name="subscribed"
            checked={formData.subscribed}
            onChange={handleChange}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <label htmlFor="subscribed" className="text-gray-700">
            <span className="font-medium">Keep me updated!</span>
            <span className="block text-sm text-gray-600 mt-1">
              Receive email updates when new articles are published and occasional reminders about supporting our mission through donations.
            </span>
          </label>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="px-8 py-4 bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting' ? 'SIGNING...' : 'SIGN THE PETITION'}
          </button>
        </div>

        <p className="text-sm text-gray-600 text-center">
          By signing, you agree to have your name added to the petition presented to the New Jersey Legislature.
        </p>
      </form>
    </div>
  );
}
