'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PinDialog } from '@/components/ui/pin-dialog';
import { Loader2, RefreshCw, Search, Trash, Download, FileText } from 'lucide-react';
import { fetchSignatures, deleteSignature } from '@/lib/actions/petition-actions';
import { PetitionSignature } from '@/types';
import { formatDate } from '@/lib/utils';

export default function PetitionsPage() {
  const [signatures, setSignatures] = useState<PetitionSignature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });
  const itemsPerPage = 25;

  const loadSignatures = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchSignatures();
      if ('error' in res) {
        setError(true);
      } else {
        setSignatures(res);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSignatures();
  }, []);

  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Remove Signature',
      description: 'Are you sure you want to remove this signature?',
      onConfirm: async () => {
        try {
          const res = await deleteSignature(id);
          if (!('error' in res)) {
            setSignatures(signatures.filter((s) => s.id !== id));
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
    if (selectedIds.size === paginatedSignatures.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedSignatures.map((s) => s.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;
    setConfirmDialog({
      open: true,
      title: 'Delete Signatures',
      description: `Are you sure you want to delete ${count} signature${count !== 1 ? 's' : ''}?`,
      onConfirm: async () => {
        setBulkDeleting(true);
        try {
          const ids = Array.from(selectedIds);
          const results = await Promise.allSettled(ids.map((id) => deleteSignature(id)));
          const succeeded = new Set(ids.filter((_, i) => {
            const r = results[i];
            return r.status === 'fulfilled' && !('error' in (r.value ?? {}));
          }));
          const failed = ids.length - succeeded.size;
          setSignatures((prev) => prev.filter((s) => !succeeded.has(s.id)));
          setSelectedIds(new Set());
          if (failed > 0) alert(`${failed} signature${failed !== 1 ? 's' : ''} failed to delete.`);
        } catch (err) {
          console.error('Bulk delete error:', err);
        } finally {
          setBulkDeleting(false);
        }
      },
    });
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'City', 'State', 'Zip Code', 'Subscribed', 'Date Signed'];
    const rows = filteredSignatures.map((s) => [
      s.name.replace(/"/g, '""'),
      s.email,
      (s.city || '').replace(/"/g, '""'),
      s.state || '',
      s.zipcode || '',
      s.subscribed ? 'Yes' : 'No',
      s.created_at ? new Date(s.created_at).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `petition-signatures-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSignatures = signatures.filter((sig) => {
    const search = searchTerm.toLowerCase();
    return (
      sig.name?.toLowerCase().includes(search) ||
      sig.email?.toLowerCase().includes(search) ||
      sig.city?.toLowerCase().includes(search) ||
      sig.zipcode?.includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredSignatures.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  const paginatedSignatures = filteredSignatures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const subscribedCount = signatures.filter((s) => s.subscribed).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Petition Signatures</h1>
          {!loading && (
            <p className="text-sm text-gray-500 mt-1">
              {signatures.length} total &middot; {subscribedCount} subscribed
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search signatures..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={loadSignatures} disabled={loading} title="Refresh">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowPinDialog(true)} disabled={loading || signatures.length === 0} title="Export CSV">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          <p>Error fetching signatures. Please try again.</p>
          <Button variant="outline" className="mt-2" onClick={loadSignatures}>
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && !error && signatures.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No petition signatures yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            When people sign the petition, their signatures will appear here
          </p>
        </div>
      )}

      {!loading && !error && signatures.length > 0 && (
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
                        checked={paginatedSignatures.length > 0 && selectedIds.size === paginatedSignatures.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Email</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Location</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Subscribed</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Date</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSignatures.map((sig) => (
                    <tr key={sig.id} className={`border-b hover:bg-gray-50 ${selectedIds.has(sig.id) ? 'bg-red-50/50' : ''}`}>
                      <td className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(sig.id)}
                          onChange={() => toggleSelect(sig.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{sig.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px] md:hidden">{sig.email}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="truncate max-w-[200px]">{sig.email}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <p>{[sig.city, sig.state, sig.zipcode].filter(Boolean).join(', ') || 'N/A'}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${sig.subscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                          {sig.subscribed ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        {sig.created_at ? formatDate(sig.created_at) : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(sig.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card layout */}
          <div className="sm:hidden space-y-3">
            {paginatedSignatures.map((sig) => (
              <div key={sig.id} className={`bg-white rounded-lg border p-4 space-y-2 ${selectedIds.has(sig.id) ? 'ring-2 ring-red-200 bg-red-50/50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(sig.id)}
                      onChange={() => toggleSelect(sig.id)}
                      className="h-4 w-4 rounded border-gray-300 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{sig.name}</p>
                      <p className="text-sm text-gray-500 truncate">{sig.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(sig.id)}
                    className="text-red-600 hover:bg-red-50 flex-shrink-0"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                  <span>{[sig.city, sig.state, sig.zipcode].filter(Boolean).join(', ') || 'No location'}</span>
                  <span>{sig.created_at ? formatDate(sig.created_at) : 'N/A'}</span>
                </div>
                {sig.subscribed && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Subscribed
                  </span>
                )}
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
                Page {currentPage} of {totalPages} ({filteredSignatures.length} total)
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

      {filteredSignatures.length === 0 && searchTerm && !loading && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p>No signatures found matching &quot;{searchTerm}&quot;</p>
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
        confirmLabel="Delete"
        onConfirm={confirmDialog.onConfirm}
      />

      <PinDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        title="Export Petition Data"
        description="Enter your admin PIN to export petition signatures."
        onVerified={handleExportCSV}
      />
    </div>
  );
}
