'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import FocusTrap from 'focus-trap-react';

interface NavItem {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .replace(/(?:^|[\s/])\w/g, (match) => match.toUpperCase());
}

export default function MobileNav({ isOpen, onClose, navItems }: MobileNavProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset expanded items when the drawer opens (React 19 derived-state reset).
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen && expandedItems.length > 0) {
      setExpandedItems([]);
    }
  }

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  // Focus the close button after the drawer becomes visible.
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <FocusTrap focusTrapOptions={{ initialFocus: false, allowOutsideClick: true, escapeDeactivates: true }}>
      <div>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div id="mobile-nav" role="dialog" aria-label="Mobile navigation" className="fixed inset-y-0 right-0 w-full max-w-md bg-[#1a1a1a] z-50 overflow-y-auto">
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white hover:text-green-500 z-10"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-800">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <Image
              src="/images/gsa-logo.webp"
              alt="Garden State Abolitionists logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
            <div className="leading-tight text-white">
              <div className="text-xs font-bold tracking-widest">GARDEN STATE</div>
              <div className="text-xs font-bold tracking-widest flex items-center gap-2">
                ABOLITIONISTS
                <span className="inline-flex flex-col gap-[2px]">
                  <span className="block w-6 h-[1.5px] bg-white" />
                  <span className="block w-6 h-[1.5px] bg-white" />
                  <span className="block w-6 h-[1.5px] bg-white" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Donate Button at Top */}
        <Link
          href="/donate"
          onClick={onClose}
          className="block w-full px-6 py-4 bg-green-800 text-white font-semibold text-sm hover:bg-green-900 transition-colors"
        >
          Donate
        </Link>

        {/* Navigation Items */}
        <nav aria-label="Mobile navigation">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-gray-800">
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className="w-full flex items-center justify-between px-6 py-4 text-white text-sm hover:bg-[#2a2a2a] transition-colors"
                    aria-expanded={expandedItems.includes(item.label)}
                  >
                    <span>{toTitleCase(item.label)}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedItems.includes(item.label) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedItems.includes(item.label) && (
                    <div className="bg-[#111] py-1">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          onClick={onClose}
                          className="block px-10 py-3 text-sm text-gray-300 hover:text-green-500 transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="block px-6 py-4 text-white text-sm hover:bg-[#2a2a2a] transition-colors"
                >
                  {toTitleCase(item.label)}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      </div>
    </FocusTrap>
  );
}
