import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delete My Data',
  description: 'Request deletion of your petition signature, contact inquiries, or email subscription from Garden State Abolitionists. We respond within 30 days.',
  alternates: { canonical: '/delete-my-data' },
};

export default function DeleteMyDataLayout({ children }: { children: React.ReactNode }) {
  return children;
}
