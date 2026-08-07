'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, Mail, Newspaper, FileText, ImageIcon, LogOut, Send, Users, Handshake } from 'lucide-react';
import { useUserStore } from '@/store/use-user';
import { useRouter } from 'next/navigation';

const adminNavItems = [
  { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/admin/dashboard/inquiries', icon: Mail, label: 'Inquiries' },
  { href: '/admin/dashboard/news', icon: Newspaper, label: 'News' },
  { href: '/admin/dashboard/petitions', icon: FileText, label: 'Petitions' },
  { href: '/admin/dashboard/gallery', icon: ImageIcon, label: 'Gallery' },
  { href: '/admin/dashboard/subscribers', icon: Users, label: 'Subscribers' },
  { href: '/admin/dashboard/email', icon: Send, label: 'Email Subscribers' },
  { href: '/admin/dashboard/partners', icon: Handshake, label: 'Email Partners' },
];

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  onClick?: () => void;
}

const resetAdminScroll = () => {
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  const el = document.querySelector('[data-admin-scroll]') as HTMLElement | null;
  if (el) el.scrollTop = 0;
};

const NavItem = ({ href, icon: Icon, label, isCollapsed, onClick }: NavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={() => { resetAdminScroll(); onClick?.(); }}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors',
        isActive
          ? 'bg-red-600 text-white'
          : 'text-gray-700 hover:bg-gray-200',
        isCollapsed && 'justify-center px-2'
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

export default function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/manage-7x9k');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col h-screen border-r bg-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center px-4 border-b">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="font-bold text-lg text-red-600">
            GSA Admin
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn('ml-auto', isCollapsed && 'mx-auto')}
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto">
        {adminNavItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t p-2">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 w-full font-medium text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors',
            isCollapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
        {!isCollapsed && (
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 mt-1 text-sm text-gray-500 hover:text-gray-700"
          >
            &larr; Back to Site
          </Link>
        )}
      </div>
    </div>
  );
}
