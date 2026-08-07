import sanitize from 'sanitize-html';

const htmlEscapeMap: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

// Escape all HTML (for plain text fields like names, emails, messages)
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
}

// Sanitize HTML content (for rich text fields like news articles)
// Allows safe HTML tags but strips dangerous ones (script, event handlers, etc.)
export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: [
      'p', 'br', 'strong', 'em', 'b', 'i', 'u',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'a', 'img',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'hr',
    ],
    allowedAttributes: {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'style'],
      '*': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowProtocolRelative: false,
  });
}
