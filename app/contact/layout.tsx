import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Garden State Abolitionists — ask a question, volunteer with our team, request a speaker for your church, or join our Signal group for updates.',
  alternates: { canonical: '/contact' },
};

const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Garden State Abolitionists',
  url: 'https://www.gardenstateabolitionists.com',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'General Inquiry',
    url: 'https://www.gardenstateabolitionists.com/contact',
    availableLanguage: 'English',
  },
  sameAs: [
    'https://facebook.com/gardenstateabolitionists',
    'https://x.com/GardenStateAbol',
    'https://instagram.com/gardenstateabolitionists',
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
