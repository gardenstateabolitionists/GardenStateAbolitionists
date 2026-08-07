'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PinDialog } from '@/components/ui/pin-dialog';
import { Loader2, RefreshCw, Search, Trash, Download, UserX, Users } from 'lucide-react';
import { fetchSubscribers, unsubscribeUser, deleteSubscriber } from '@/lib/actions/subscriber-actions';
import { formatDate } from '@/lib/utils';

interface SubscriberRow {
  id: string;
  email: string;
  name?: string;
  source: string;
  subscribed: boolean;
  created_at: string;
  city?: string;
  state?: string;
  zipcode?: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; confirmLabel: string; variant: 'danger' | 'warning'; onConfirm: () => void }>({ open: false, title: '', description: '', confirmLabel: 'Confirm', variant: 'danger', onConfirm: () => {} });
  const itemsPerPage = 25;

  const loadSubscribers = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchSubscribers();
      if ('error' in res) {
        setError(true);
      } else {
        setSubscribers(res);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleUnsubscribe = (email: string, id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Unsubscribe User',
      description: `Unsubscribe ${email}? They will no longer receive newsletters.`,
      confirmLabel: 'Unsubscribe',
      variant: 'warning',
      onConfirm: async () => {
        try {
          const res = await unsubscribeUser(email);
          if (!('error' in res)) {
            setSubscribers(subscribers.filter((s) => s.id !== id));
          }
        } catch (err) {
          console.error('Unsubscribe error:', err);
        }
      },
    });
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Subscriber',
      description: 'Delete this subscriber entirely? This removes their petition signature too.',
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        try {
          const res = await deleteSubscriber(id);
          if (!('error' in res)) {
            setSubscribers(subscribers.filter((s) => s.id !== id));
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
    if (selectedIds.size === paginatedSubscribers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedSubscribers.map((s) => s.id)));
    }
  };

  const handleBulkUnsubscribe = () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;
    setConfirmDialog({
      open: true,
      title: 'Unsubscribe Users',
      description: `Unsubscribe ${count} user${count !== 1 ? 's' : ''}? They will no longer receive newsletters.`,
      confirmLabel: 'Unsubscribe',
      variant: 'warning',
      onConfirm: async () => {
        setBulkDeleting(true);
        try {
          const toUnsubscribe = subscribers.filter((s) => selectedIds.has(s.id));
          const results = await Promise.allSettled(toUnsubscribe.map((s) => unsubscribeUser(s.email)));
          const succeededEmails = new Set(toUnsubscribe.filter((_, i) => {
            const r = results[i];
            return r.status === 'fulfilled' && !('error' in (r.value ?? {}));
          }).map((s) => s.id));
          const failed = toUnsubscribe.length - succeededEmails.size;
          setSubscribers((prev) => prev.filter((s) => !succeededEmails.has(s.id)));
          setSelectedIds(new Set());
          if (failed > 0) alert(`${failed} user${failed !== 1 ? 's' : ''} failed to unsubscribe.`);
        } catch (err) {
          console.error('Bulk unsubscribe error:', err);
        } finally {
          setBulkDeleting(false);
        }
      },
    });
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'City', 'State', 'Zip Code', 'Date Subscribed'];
    const rows = filteredSubscribers.map((s) => [
      (s.name || 'Newsletter Subscriber').replace(/"/g, '""'),
      s.email,
      (s.city || '').replace(/"/g, '""'),
      s.state || '',
      s.zipcode || '',
      s.created_at ? new Date(s.created_at).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    const search = searchTerm.toLowerCase();
    return (
      sub.name?.toLowerCase().includes(search) ||
      sub.email?.toLowerCase().includes(search) ||
      sub.city?.toLowerCase().includes(search) ||
      sub.zipcode?.includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredSubscribers.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Newsletter Subscribers</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              {subscribers.length} active subscriber{subscribers.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={loadSubscribers} disabled={loading} title="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowPinDialog(true)} disabled={loading || subscribers.length === 0} title="Export CSV">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          <p>Error fetching subscribers. Please try again.</p>
          <Button variant="outline" className="mt-2" onClick={loadSubscribers}>
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && !error && subscribers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No subscribers yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            When people sign the petition and opt in, they will appear here
          </p>
        </div>
      )}

      {!loading && !error && subscribers.length > 0 && (
        <>
          {/* Bulk action bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <span className="text-sm font-medium text-red-700">
                {selectedIds.size} selected
              </span>
              <Button
                size="sm"
                onClick={handleBulkUnsubscribe}
                disabled={bulkDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {bulkDeleting ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Unsubscribing...</>
                ) : (
                  <><UserX className="h-4 w-4 mr-2" />Unsubscribe Selected</>
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
                        checked={paginatedSubscribers.length > 0 && selectedIds.size === paginatedSubscribers.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Email</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Location</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSubscribers.map((sub) => (
                    <tr key={sub.id} className={`border-b hover:bg-gray-50 ${selectedIds.has(sub.id) ? 'bg-red-50/50' : ''}`}>
                      <td className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(sub.id)}
                          onChange={() => toggleSelect(sub.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{sub.name || 'Newsletter Subscriber'}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px] md:hidden">{sub.email}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="truncate max-w-[200px]">{sub.email}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <p>{[sub.city, sub.state, sub.zipcode].filter(Boolean).join(', ') || 'N/A'}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {sub.created_at ? formatDate(sub.created_at) : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnsubscribe(sub.email, sub.id)}
                            title="Unsubscribe"
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(sub.id)}
                            className="text-red-600 hover:bg-red-50"
                            title="Delete entirely"
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
            {paginatedSubscribers.map((sub) => (
              <div key={sub.id} className={`bg-white rounded-lg border p-4 space-y-2 ${selectedIds.has(sub.id) ? 'ring-2 ring-red-200 bg-red-50/50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(sub.id)}
                      onChange={() => toggleSelect(sub.id)}
                      className="h-4 w-4 rounded border-gray-300 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{sub.name}</p>
                      <p className="text-sm text-gray-500 truncate">{sub.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnsubscribe(sub.email, sub.id)}
                      title="Unsubscribe"
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(sub.id)}
                      className="text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>{[sub.city, sub.state, sub.zipcode].filter(Boolean).join(', ') || 'No location'}</span>
                  <span>{sub.created_at ? formatDate(sub.created_at) : 'N/A'}</span>
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
                Page {currentPage} of {totalPages} ({filteredSubscribers.length} total)
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

      {filteredSubscribers.length === 0 && searchTerm && !loading && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p>No subscribers found matching &quot;{searchTerm}&quot;</p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
            Clear Search
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
      />

      <PinDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        title="Export Subscriber Data"
        description="Enter your admin PIN to export subscriber data."
        onVerified={handleExportCSV}
      />
    </div>
  );
}
