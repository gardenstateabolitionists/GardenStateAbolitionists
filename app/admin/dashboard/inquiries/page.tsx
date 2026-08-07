'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PinDialog } from '@/components/ui/pin-dialog';
import { Loader2, RefreshCw, Search, Trash, Eye, Download } from 'lucide-react';
import { fetchInquiries, deleteInquiry } from '@/lib/actions/inquiry-actions';
import { Inquiry } from '@/types';
import { formatDate } from '@/lib/utils';
import InquiryModal from '../../components/inquiry-modal';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  responded: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const itemsPerPage = 25;

  const loadInquiries = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchInquiries();
      if ('error' in res) {
        setError(true);
      } else {
        setInquiries(res);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleView = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Inquiry',
      description: 'Are you sure you want to delete this inquiry?',
      onConfirm: async () => {
        try {
          const res = await deleteInquiry(id);
          if (!('error' in res)) {
            setInquiries(inquiries.filter((i) => i.id !== id));
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
    if (selectedIds.size === paginatedInquiries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedInquiries.map((i) => i.id)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;
    setConfirmDialog({
      open: true,
      title: 'Delete Inquiries',
      description: `Are you sure you want to delete ${count} inquiry${count !== 1 ? 'ies' : ''}?`,
      onConfirm: async () => {
        setBulkDeleting(true);
        try {
          const ids = Array.from(selectedIds);
          const results = await Promise.allSettled(ids.map((id) => deleteInquiry(id)));
          const succeeded = new Set(ids.filter((_, i) => {
            const r = results[i];
            return r.status === 'fulfilled' && !('error' in (r.value ?? {}));
          }));
          const failed = ids.length - succeeded.size;
          setInquiries((prev) => prev.filter((i) => !succeeded.has(i.id)));
          setSelectedIds(new Set());
          if (failed > 0) alert(`${failed} inquiry${failed !== 1 ? 'ies' : ''} failed to delete.`);
        } catch (err) {
          console.error('Bulk delete error:', err);
        } finally {
          setBulkDeleting(false);
        }
      },
    });
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Subject', 'Message', 'Status', 'Date'];
    const rows = filteredInquiries.map((i) => [
      i.name,
      i.email,
      i.subject || '',
      i.message.replace(/"/g, '""'),
      i.status,
      i.created_at ? new Date(i.created_at).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const search = searchTerm.toLowerCase();
    return (
      inquiry.name?.toLowerCase().includes(search) ||
      inquiry.email?.toLowerCase().includes(search) ||
      inquiry.subject?.toLowerCase().includes(search) ||
      inquiry.status?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredInquiries.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  const paginatedInquiries = filteredInquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Inquiry Management</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowPinDialog(true)} disabled={loading || inquiries.length === 0} title="Export CSV">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={loadInquiries} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          <p>Error fetching inquiries. Please try again.</p>
          <Button variant="outline" className="mt-2" onClick={loadInquiries}>
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && !error && inquiries.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Mail className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No inquiries yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            When people submit contact forms, they will appear here
          </p>
        </div>
      )}

      {!loading && !error && inquiries.length > 0 && (
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
                        checked={paginatedInquiries.length > 0 && selectedIds.size === paginatedInquiries.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium hidden md:table-cell">Subject</th>
                    <th className="text-left p-4 font-medium hidden lg:table-cell">Date</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className={`border-b hover:bg-gray-50 ${selectedIds.has(inquiry.id) ? 'bg-red-50/50' : ''}`}>
                      <td className="p-4 w-10">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(inquiry.id)}
                          onChange={() => toggleSelect(inquiry.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{inquiry.name}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">{inquiry.email}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="truncate max-w-[200px]">{inquiry.subject || 'No subject'}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        {inquiry.created_at ? formatDate(inquiry.created_at) : 'N/A'}
                      </td>
                      <td className="p-4">
                        <Badge className={statusColors[inquiry.status] || 'bg-gray-100'}>
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(inquiry)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(inquiry.id)}
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
            {paginatedInquiries.map((inquiry) => (
              <div key={inquiry.id} className={`bg-white rounded-lg border p-4 space-y-2 ${selectedIds.has(inquiry.id) ? 'ring-2 ring-red-200 bg-red-50/50' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(inquiry.id)}
                      onChange={() => toggleSelect(inquiry.id)}
                      className="h-4 w-4 rounded border-gray-300 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{inquiry.name}</p>
                      <p className="text-sm text-gray-500 truncate">{inquiry.email}</p>
                    </div>
                  </div>
                  <Badge className={`flex-shrink-0 ${statusColors[inquiry.status] || 'bg-gray-100'}`}>
                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                  </Badge>
                </div>
                {inquiry.subject && (
                  <p className="text-sm text-gray-600 truncate">{inquiry.subject}</p>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-400">
                    {inquiry.created_at ? formatDate(inquiry.created_at) : 'N/A'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(inquiry)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(inquiry.id)}
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
                Page {currentPage} of {totalPages} ({filteredInquiries.length} total)
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

      {filteredInquiries.length === 0 && searchTerm && !loading && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p>No inquiries found matching &quot;{searchTerm}&quot;</p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
            Clear Search
          </Button>
        </div>
      )}

      <InquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        inquiry={selectedInquiry}
        onUpdate={loadInquiries}
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
        title="Export Inquiry Data"
        description="Enter your admin PIN to export inquiry data."
        onVerified={handleExportCSV}
      />
    </div>
  );
}

function Mail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
