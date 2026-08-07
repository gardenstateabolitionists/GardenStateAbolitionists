'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertTriangle, Bold, Italic, Link, Heading2, Pilcrow, List, ListOrdered, CornerDownLeft, ImageIcon, PenLine, Eye, Quote } from 'lucide-react';
import { PinDialog } from '@/components/ui/pin-dialog';
import { createNewsArticle, updateNewsArticle } from '@/lib/actions/news-actions';
import { sanitizeHtml } from '@/lib/sanitize';
import { NewsArticle } from '@/types';
import { slugify } from '@/lib/utils';

interface NewsModalProps {
  open: boolean;
  onClose: () => void;
  article: NewsArticle | null;
  isCreating: boolean;
  onSave: () => void;
}

function insertTag(
  textarea: HTMLTextAreaElement,
  before: string,
  after: string,
  content: string,
  setContent: (v: string) => void
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = content.substring(start, end);
  const replacement = before + (selected || 'text') + after;
  const newContent = content.substring(0, start) + replacement + content.substring(end);
  setContent(newContent);

  requestAnimationFrame(() => {
    textarea.focus();
    const cursorPos = selected
      ? start + replacement.length
      : start + before.length + 4;
    textarea.setSelectionRange(cursorPos, cursorPos);
  });
}

export default function NewsModal({ open, onClose, article, isCreating, onSave }: NewsModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    published: false,
    // Default TRUE: publishing normally shares to FB + IG.
    // Uncheck for silent publish (testing, minor content, timing).
    auto_post_to_social: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'compose' | 'preview'>('compose');
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (article && !isCreating) {
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        image: article.image || '',
        published: article.published || false,
        auto_post_to_social: article.auto_post_to_social ?? true,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        published: false,
        auto_post_to_social: true,
      });
    }
    setActiveTab('compose');
  }, [article, isCreating, open]);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: isCreating ? slugify(value) : prev.slug,
    }));
  };

  const setContent = (value: string) => {
    setFormData((prev) => ({ ...prev, content: value }));
  };

  // Check if publishing will trigger a newsletter send
  const willSendNewsletter =
    formData.published && (isCreating || (article && !article.published));

  const handleSubmit = () => {
    setErrorMessage('');
    if (!formData.title || !formData.excerpt || !formData.content) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setShowPinDialog(true);
  };

  const handlePinVerified = async () => {
    if (willSendNewsletter) {
      setShowPublishConfirm(true);
      return;
    }

    await doSubmit(formData);
  };

  const handlePublishConfirm = async () => {
    setShowPublishConfirm(false);
    await doSubmit(formData);
  };

  const handleSaveAsDraft = async () => {
    setShowPublishConfirm(false);
    await doSubmit({ ...formData, published: false });
  };

  const doSubmit = async (data: typeof formData) => {
    setIsSubmitting(true);
    try {
      let res;
      if (isCreating) {
        res = await createNewsArticle(data);
      } else if (article) {
        res = await updateNewsArticle(article.id, data);
      }

      if (res && 'error' in res) {
        setErrorMessage(res.error || 'Failed to save article.');
      } else if (res) {
        setErrorMessage('');
        onSave();
        onClose();
      } else {
        setErrorMessage('Failed to save article.');
      }
    } catch (error) {
      console.error('Save error:', error);
      setErrorMessage('Failed to save article.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToolbar = (action: string) => {
    const ta = contentRef.current;
    if (!ta) return;

    switch (action) {
      case 'bold':
        insertTag(ta, '<strong>', '</strong>', formData.content, setContent);
        break;
      case 'italic':
        insertTag(ta, '<em>', '</em>', formData.content, setContent);
        break;
      case 'h2':
        insertTag(ta, '<h2>', '</h2>', formData.content, setContent);
        break;
      case 'h3':
        insertTag(ta, '<h3>', '</h3>', formData.content, setContent);
        break;
      case 'paragraph':
        insertTag(ta, '<p>', '</p>', formData.content, setContent);
        break;
      case 'ul':
        insertTag(ta, '<ul>\n  <li>', '</li>\n</ul>', formData.content, setContent);
        break;
      case 'ol':
        insertTag(ta, '<ol>\n  <li>', '</li>\n</ol>', formData.content, setContent);
        break;
      case 'br':
        insertTag(ta, '<br>', '', formData.content, setContent);
        break;
      case 'blockquote':
        insertTag(ta, '<blockquote>', '</blockquote>', formData.content, setContent);
        break;
      case 'code':
        insertTag(ta, '<pre><code>', '</code></pre>', formData.content, setContent);
        break;
      case 'hr':
        insertTag(ta, '<hr>', '', formData.content, setContent);
        break;
      case 'link': {
        const url = window.prompt('Enter URL:');
        if (url) {
          try {
            const parsed = new URL(url);
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
              const safeUrl = url.replace(/"/g, '&quot;');
              insertTag(ta, `<a href="${safeUrl}">`, '</a>', formData.content, setContent);
            } else {
              alert('Only http and https URLs are allowed.');
            }
          } catch {
            alert('Please enter a valid URL (e.g. https://example.com).');
          }
        }
        break;
      }
      case 'image': {
        const imgUrl = window.prompt('Enter image URL:');
        if (imgUrl) {
          try {
            const parsed = new URL(imgUrl);
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
              const alt = window.prompt('Enter alt text (description of image):', '') || '';
              const width = window.prompt('Enter width in pixels (optional, e.g. 800):', '');
              const safeUrl = imgUrl.replace(/"/g, '&quot;');
              const safeAlt = alt.replace(/"/g, '&quot;');
              const widthAttr = width && /^\d+$/.test(width) ? ` width="${width}"` : '';
              insertTag(ta, `<img src="${safeUrl}" alt="${safeAlt}"${widthAttr} style="max-width:100%;height:auto;" />`, '', formData.content, setContent);
            } else {
              alert('Only http and https URLs are allowed.');
            }
          } catch {
            alert('Please enter a valid image URL (e.g. https://example.com/photo.jpg).');
          }
        }
        break;
      }
    }
  };

  const toolbarButtons = [
    { action: 'bold', icon: Bold, label: 'Bold' },
    { action: 'italic', icon: Italic, label: 'Italic' },
    { action: 'link', icon: Link, label: 'Link' },
    { action: 'image', icon: ImageIcon, label: 'Image' },
    { action: 'h2', icon: Heading2, label: 'Heading 2' },
    { action: 'paragraph', icon: Pilcrow, label: 'Paragraph' },
    { action: 'ul', icon: List, label: 'Bullet List' },
    { action: 'ol', icon: ListOrdered, label: 'Ordered List' },
    { action: 'blockquote', icon: Quote, label: 'Blockquote' },
    { action: 'br', icon: CornerDownLeft, label: 'Line Break' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <DialogTitle>{isCreating ? 'Create New Article' : 'Edit Article'}</DialogTitle>
              <DialogDescription>
                {isCreating ? 'Fill in the details for your new article' : 'Update the article details'}
              </DialogDescription>
            </div>
            <div className="flex w-full sm:w-auto bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setActiveTab('compose')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'compose' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <PenLine size={14} />
                Compose
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preview' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye size={14} />
                Preview
              </button>
            </div>
          </div>
        </DialogHeader>

        {activeTab === 'compose' ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="article-url-slug"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief summary of the article"
                rows={2}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <Label>Content *</Label>

              {/* Toolbar */}
              <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-300 border-b-0 rounded-t-md mt-1">
                {toolbarButtons.map((btn) => (
                  <button
                    key={btn.action}
                    type="button"
                    onClick={() => handleToolbar(btn.action)}
                    title={btn.label}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <btn.icon size={16} />
                  </button>
                ))}
              </div>

              <textarea
                ref={contentRef}
                id="content"
                value={formData.content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Full article content (HTML supported)"
                rows={14}
                className="w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="image">Featured Image URL</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <Label htmlFor="published" className="font-normal">
                Publish immediately
              </Label>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="auto_post_to_social"
                checked={formData.auto_post_to_social}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, auto_post_to_social: e.target.checked }))
                }
                disabled={!formData.published && (!article || !article.published)}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 mt-0.5 disabled:opacity-50"
              />
              <div>
                <Label htmlFor="auto_post_to_social" className="font-normal">
                  Also post to Facebook and Instagram
                </Label>
                <p className="text-xs text-gray-500">
                  Only fires on the draft-to-publish transition. Uncheck to publish silently
                  (useful for testing or when you want to share manually later).
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Tab */
          <div className="space-y-4">
            {/* Article Preview */}
            <div className="border rounded-lg overflow-hidden">
              {/* Hero */}
              <div className="relative bg-[#1a1a1a] text-white py-10 px-6 text-center">
                {formData.image && (
                  <div className="absolute inset-0 opacity-30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative">
                  <p className="text-gray-400 text-sm mb-2">
                    {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h1 className="text-2xl font-bold">{formData.title || '(No title)'}</h1>
                </div>
              </div>

              {/* Excerpt */}
              <div className="px-6 py-4 bg-gray-50 border-b">
                <p className="text-gray-600 italic text-sm">{formData.excerpt || '(No excerpt)'}</p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                {formData.content ? (
                  <article
                    className="prose prose-sm max-w-none prose-headings:text-[#1a1a1a] prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(formData.content) }}
                  />
                ) : (
                  <p className="text-gray-400 italic">(No content yet)</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => setActiveTab('compose')}
                variant="outline"
              >
                Back to Compose
              </Button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {errorMessage}
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : isCreating ? (
              'Create Article'
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      <PinDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        title={isCreating ? 'Confirm Article Creation' : 'Confirm Article Update'}
        description="Enter your admin PIN to save this article."
        onVerified={handlePinVerified}
        loading={isSubmitting}
      />

      {/* Publish Confirmation Dialog */}
      {showPublishConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-amber-100 rounded-full p-2 flex-shrink-0">
                <AlertTriangle size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Publish Article?</h3>
                <p className="text-gray-600 mt-1">
                  Publishing this article will <strong>send a newsletter email to all subscribers</strong>
                  {formData.auto_post_to_social && (
                    <> AND <strong>auto-post to Facebook and Instagram</strong></>
                  )}
                  . This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleSaveAsDraft}>
                Save as Draft
              </Button>
              <Button
                onClick={handlePublishConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Publish & Notify Subscribers
              </Button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
