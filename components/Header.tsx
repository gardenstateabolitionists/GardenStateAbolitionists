'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import MobileNav from './MobileNav';

const navItems = [
  { label: 'HOME', href: '/' },
  { label: 'WHO WE ARE', href: '/who-we-are' },
  {
    label: 'WHAT WE BELIEVE',
    href: '/what-we-believe',
    dropdown: [
      { label: 'Overview', href: '/what-we-believe' },
      { label: 'Abolitionist, Not Pro-Life', href: '/what-we-believe/abolitionist-not-pro-life' },
      { label: 'Biblical, Not Secular', href: '/what-we-believe/biblical-not-secular' },
      { label: 'Immediate, Not Gradual', href: '/what-we-believe/immediate-not-gradual' },
      { label: 'No Exceptions', href: '/what-we-believe/no-exceptions' },
      { label: 'Ignore Roe', href: '/what-we-believe/ignore-roe' },
      { label: 'Criminalization', href: '/what-we-believe/criminalization' },
    ],
  },
  {
    label: 'THE GOSPEL',
    href: '/the-gospel',
    dropdown: [
      { label: 'Overview', href: '/the-gospel' },
      { label: 'The Gospel', href: '/the-gospel/gospel' },
      { label: 'Abolitionism & the Kingdom of God', href: '/the-gospel/kingdom-of-god' },
      { label: 'Abolitionism & the Great Commission', href: '/the-gospel/great-commission' },
      { label: 'Message of Reconciliation', href: '/the-gospel/message-of-reconciliation' },
      { label: 'The Answer to Abortion', href: '/the-gospel/answer-to-abortion' },
      { label: 'The Incarnation', href: '/the-gospel/incarnation' },
    ],
  },
  { label: 'THE PETITION', href: '/the-petition' },
  {
    label: 'ABOLITION BILLS',
    href: '/abolition-bills',
    dropdown: [
      { label: 'Where New Jersey Stands', href: '/abolition-bills' },
      { label: 'Components of an Abolition Bill', href: '/abolition-bills/components' },
      { label: 'Your Legislators', href: '/legislators' },
    ],
  },
  {
    label: 'NEWS/EDUCATION',
    href: '/news',
    dropdown: [
      { label: 'News', href: '/news' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Media', href: '/media' },
      { label: 'Allied Groups', href: '/partners' },
      { label: 'The Norman Statement', href: '/norman-statement' },
      { label: 'Abortion Facilities', href: '/abortion-mills' },
    ],
  },
  { label: 'CONTACT US', href: '/contact' },
];

function isCurrentPage(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuItemRefs = useRef<Map<string, HTMLAnchorElement[]>>(new Map());

  // Close dropdown on route change. React 19 pattern: derived-state reset
  // via useState + conditional setState during render (not an effect).
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (activeDropdown !== null) {
      setActiveDropdown(null);
    }
  }

  const handleDropdownEnter = useCallback((label: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(label);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  const handleLinkClick = useCallback(() => {
    setActiveDropdown(null);
  }, []);

  const setMenuItemRef = useCallback((label: string, index: number, el: HTMLAnchorElement | null) => {
    if (!el) return;
    const refs = menuItemRefs.current.get(label) || [];
    refs[index] = el;
    menuItemRefs.current.set(label, refs);
  }, []);

  const focusMenuItem = useCallback((label: string, index: number) => {
    const refs = menuItemRefs.current.get(label);
    refs?.[index]?.focus();
  }, []);

  const handleTriggerKeyDown = useCallback((e: React.KeyboardEvent, item: typeof navItems[0]) => {
    if (!item.dropdown) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveDropdown(item.label);
      // Focus first menu item after dropdown opens
      requestAnimationFrame(() => focusMenuItem(item.label, 0));
    }
  }, [focusMenuItem]);

  const handleMenuKeyDown = useCallback((e: React.KeyboardEvent, label: string, itemCount: number) => {
    const refs = menuItemRefs.current.get(label);
    if (!refs) return;
    const currentIndex = refs.indexOf(e.target as HTMLAnchorElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusMenuItem(label, currentIndex < itemCount - 1 ? currentIndex + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusMenuItem(label, currentIndex > 0 ? currentIndex - 1 : itemCount - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusMenuItem(label, 0);
        break;
      case 'End':
        e.preventDefault();
        focusMenuItem(label, itemCount - 1);
        break;
      case 'Escape':
        e.preventDefault();
        setActiveDropdown(null);
        break;
    }
  }, [focusMenuItem]);

  return (
    <header className="bg-[#1a1a1a] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/images/gsa-logo.webp"
              alt="Garden State Abolitionists logo"
              width={36}
              height={36}
              className="h-9 w-auto"
            />
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-widest">GARDEN STATE</div>
              <div className="text-sm font-bold tracking-widest flex items-center gap-2">
                ABOLITIONISTS
                <span className="inline-flex flex-col gap-[2px]">
                  <span className="block w-8 h-[2px] bg-white" />
                  <span className="block w-8 h-[2px] bg-white" />
                  <span className="block w-8 h-[2px] bg-white" />
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation.
              Turns on at xl, not lg: the full row needs ~1210px, so between
              1024 and 1279 it overflowed its container by 240px and pushed the
              DONATE button off the right edge of the screen. */}
          <nav className="hidden xl:flex items-center" aria-label="Main navigation">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={item.dropdown ? () => handleDropdownEnter(item.label) : undefined}
                onMouseLeave={item.dropdown ? handleDropdownLeave : undefined}
              >
                <Link
                  href={item.href}
                  className="px-2 py-4 text-[11px] font-semibold hover:text-green-500 transition-colors flex items-center tracking-wide whitespace-nowrap"
                  aria-haspopup={item.dropdown ? 'true' : undefined}
                  aria-expanded={item.dropdown ? activeDropdown === item.label : undefined}
                  aria-current={isCurrentPage(pathname, item.href) ? 'page' : undefined}
                  onClick={handleLinkClick}
                  onKeyDown={(e) => handleTriggerKeyDown(e, item)}
                >
                  {item.label}
                  {item.dropdown && (
                    <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>
                {item.dropdown && (
                  <div
                    className={`dropdown-content absolute left-0 top-full bg-[#1a1a1a] min-w-[220px] py-2 shadow-lg border-t border-green-700 ${activeDropdown === item.label ? 'dropdown-open' : ''}`}
                    role="menu"
                    aria-label={`${item.label} submenu`}
                    onKeyDown={(e) => handleMenuKeyDown(e, item.label, item.dropdown!.length)}
                  >
                    {item.dropdown.map((subItem, index) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block px-4 py-2 text-xs hover:bg-[#2a2a2a] hover:text-green-500 transition-colors"
                        role="menuitem"
                        ref={(el) => setMenuItemRef(item.label, index, el)}
                        onClick={handleLinkClick}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/donate"
              className="ml-2 px-6 py-4 bg-green-800 text-white text-xs font-bold hover:bg-green-900 transition-colors tracking-wide"
              aria-current={pathname === '/donate' ? 'page' : undefined}
            >
              DONATE
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden p-2 ml-auto"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
      />
    </header>
  );
}
