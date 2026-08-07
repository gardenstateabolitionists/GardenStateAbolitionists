import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Restricted',
  // Prevent search-engine indexing of the admin login page so removing it
  // from robots.txt (which is publicly readable) doesn't create a discovery
  // hazard.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function ManageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
