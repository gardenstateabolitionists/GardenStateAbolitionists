import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Garden State Abolitionists',
  description: 'Administrative dashboard for Garden State Abolitionists',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="admin-area" className="bg-gray-50 min-h-screen">{children}</div>
  );
}
