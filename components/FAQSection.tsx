'use client';

import { useState, useEffect } from 'react';

interface FAQItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface FAQSectionProps {
  items: FAQItem[];
}

export default function FAQSection({ items }: FAQSectionProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(items[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Table of Contents - Sidebar */}
      <aside className="lg:w-72 flex-shrink-0">
        <div className="lg:sticky lg:top-24 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200">CONTENTS</h3>
          <nav className="faq-sidebar max-h-[60vh] overflow-y-auto space-y-1">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                  activeSection === item.id
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* FAQ Content */}
      <div className="flex-1 min-w-0" role="region" aria-label="FAQ answers">
        {items.map((item) => (
          <section key={item.id} id={item.id} className="faq-section mb-12 pb-8 border-b border-gray-200 last:border-0">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#1a1a1a]">{item.title}</h2>
            <div className="prose prose-lg max-w-none">
              {item.content}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
