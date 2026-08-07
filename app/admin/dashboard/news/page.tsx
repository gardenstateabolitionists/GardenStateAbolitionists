'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PinDialog } from '@/components/ui/pin-dialog';
import { Loader2, RefreshCw, Search, Plus, Edit, Trash, Download } from 'lucide-react';
import { fetchNewsArticles, deleteNewsArticle } from '@/lib/actions/news-actions';
import { NewsArticle } from '@/types';
import { formatDate } from '@/lib/utils';
import NewsModal from '../../components/news-modal';

export default function NewsManagementPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const itemsPerPage = 25;
  const [modalOpen, setModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const loadArticles = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchNewsArticles(false);
      if ('error' in res) {
        setError(true);
      } else {
        setArticles(res);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleCreate = () => {
    setSelectedArticle(null);
    setIsCreating(true);
    setModalOpen(true);
  };

  const handleEdit = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Article',
      description: 'Are you sure you want to delete this article?',
      onConfirm: async () => {
        try {
          const res = await deleteNewsArticle(id);
          if (!('error' in res)) {
            setArticles(articles.filter((a) => a.id !== id));
          }
        } catch (err) {
          console.error('Delete error:', err);
        }
      },
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedArticles.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedArticles.map((a) => a.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;
    setConfirmDialog({
      open: true,
      title: 'Delete Articles',
      description: `Are you sure you want to delete ${count} article${count !== 1 ? 's' : ''}?`,
      onConfirm: async () => {
        setBulkDeleting(true);
        try {
          const ids = Array.from(selectedIds);
          const results = await Promise.allSettled(ids.map((id) => deleteNewsArticle(id)));
          const succeeded = new Set(ids.filter((_, i) => {
            const r = results[i];
            return r.status === 'fulfilled' && !('error' in (r.value ?? {}));
          }));
          const failed = ids.length - succeeded.size;
          setArticles((prev) => prev.filter((a) => !succeeded.has(a.id)));
          setSelectedIds(new Set());
          if (failed > 0) alert(`${failed} article${failed !== 1 ? 's' : ''} failed to delete.`);
        } catch (err) {
          console.error('Bulk delete error:', err);
        } finally {
          setBulkDeleting(false);
        }
      },
    });
  };

  const handleExportCSV = () => {
    const headers = ['Title', 'Slug', 'Excerpt', 'Published', 'Created', 'Updated'];
    const rows = filteredArticles.map((art) => [
      art.title,
      art.slug,
      art.excerpt.replace(/"/g, '""'),
      art.published ? 'Yes' : 'No',
      art.created_at ? new Date(art.created_at).toLocaleDateString() : '',
      art.updated_at ? new Date(art.updated_at).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `news-articles-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredArticles = articles.filter((article) => {
    const search = searchTerm.toLowerCase();
    return (
      article.title?.toLowerCase().includes(search) ||
      article.excerpt?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">News Management</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowPinDialog(true)} disabled={loading || articles.length === 0} title="Export CSV">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={loadArticles} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleCreate} className="flex-shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Article</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          <p>Error fetching articles. Please try again.</p>
          <Button variant="outline" className="mt-2" onClick={loadArticles}>
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Newspaper className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No articles yet</h3>
          <p className="text-sm text-gray-500 mt-2">Create your first news article to get started</p>
          <Button className="mt-4" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Article
          </Button>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-red-700">
                {selectedIds.size} selected
              </span>
              <Button
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {bulkDeleting ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Deleting...</>
                ) : (
                  <><Trash className="h-4 w-4 mr-2" />Delete Selected</>
                )}
              </Button>
            </div>
          )}

          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-4 w-10">
                      <input
                        type="checkbox"
                        checked={paginatedArticles.length > 0 && selectedIds.size === paginatedArticles.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left p-4 font-medium">Title</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedArticles.map((article) => (
                    <tr key={article.id} className={`border-b hover:bg-gray-50 ${selectedIds.has(article.id) ? 'bg-red-50/50' : ''}`}>
                      <td className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(article.id)}
                          onChange={() => toggleSelect(article.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[300px]">{article.excerpt}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {article.created_at ? formatDate(article.created_at) : 'N/A'}
                      </td>
                      <td className="p-4">
                        <Badge className={article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {article.published ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card layout */}
          <div className="sm:hidden space-y-3">
            {paginatedArticles.map((article) => (
              <div key={article.id} className={`bg-white rounded-lg border p-4 space-y-2 ${selectedIds.has(article.id) ? 'ring-2 ring-red-200 bg-red-50/50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(article.id)}
                      onChange={() => toggleSelect(article.id)}
                      className="h-4 w-4 rounded border-gray-300 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium line-clamp-2">{article.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1 mt-1">{article.excerpt}</p>
                    </div>
                  </div>
                  <Badge className={`flex-shrink-0 ${article.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {article.published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-400">
                    {article.created_at ? formatDate(article.created_at) : 'N/A'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg border px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); setSelectedIds(new Set()); const el = document.querySelector("[data-admin-scroll]"); if (el) el.scrollTop = 0; }}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({filteredArticles.length} total)
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); setSelectedIds(new Set()); const el = document.querySelector("[data-admin-scroll]"); if (el) el.scrollTop = 0; }}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <NewsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        article={selectedArticle}
        isCreating={isCreating}
        onSave={loadArticles}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel="Delete"
        onConfirm={confirmDialog.onConfirm}
      />

      <PinDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        title="Export News Data"
        description="Enter your admin PIN to export news articles."
        onVerified={handleExportCSV}
      />
    </div>
  );
}

function Newspaper(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  );
}
