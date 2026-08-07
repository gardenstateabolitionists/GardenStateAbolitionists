'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PinDialog } from '@/components/ui/pin-dialog';
import { Loader2, RefreshCw, Plus, Trash, Edit, ImageIcon, Download } from 'lucide-react';
import {
  fetchGalleryPhotos,
  deleteGalleryPhoto,
} from '@/lib/actions/gallery-actions';
import { GalleryPhoto } from '@/types';
import Image from 'next/image';
import GalleryModal from '../../components/gallery-modal';

export default function GalleryManagementPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const itemsPerPage = 24;

  // Clamp currentPage when photos are deleted
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(photos.length / itemsPerPage));
    if (currentPage > maxPage) setCurrentPage(maxPage);
  }, [photos.length, currentPage]);

  const loadPhotos = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetchGalleryPhotos();
      if ('error' in res) {
        setError(true);
      } else {
        setPhotos(res);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleAdd = () => {
    setSelectedPhoto(null);
    setIsCreating(true);
    setModalOpen(true);
  };

  const handleEdit = (photo: GalleryPhoto) => {
    setSelectedPhoto(photo);
    setIsCreating(false);
    setModalOpen(true);
  };

  const handleExportCSV = () => {
    const headers = ['URL', 'Caption', 'Sort Order', 'Date Added'];
    const rows = photos.map((p) => [
      p.url,
      (p.caption || '').replace(/"/g, '""'),
      String(p.sortOrder || 0),
      p.created_at ? new Date(p.created_at).toLocaleDateString() : '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gallery-photos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;
    setConfirmDialog({
      open: true,
      title: 'Delete Photos',
      description: `Are you sure you want to delete ${count} photo${count !== 1 ? 's' : ''}?`,
      onConfirm: async () => {
        setBulkDeleting(true);
        try {
          const ids = Array.from(selectedIds);
          const results = await Promise.allSettled(ids.map((id) => deleteGalleryPhoto(id)));
          const succeeded = new Set(ids.filter((_, i) => results[i].status === 'fulfilled'));
          const failed = ids.length - succeeded.size;
          setPhotos((prev) => prev.filter((p) => !succeeded.has(p.id)));
          setSelectedIds(new Set());
          if (failed > 0) alert(`${failed} photo${failed !== 1 ? 's' : ''} failed to delete.`);
        } catch (err) {
          console.error('Bulk delete error:', err);
        } finally {
          setBulkDeleting(false);
        }
      },
    });
  };

  const handleDelete = (id: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Photo',
      description: 'Are you sure you want to delete this photo?',
      onConfirm: async () => {
        try {
          const res = await deleteGalleryPhoto(id);
          if (!('error' in res)) {
            setPhotos(photos.filter((p) => p.id !== id));
          }
        } catch (err) {
          console.error('Delete error:', err);
        }
      },
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Photo Gallery</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowPinDialog(true)} disabled={loading || photos.length === 0} title="Export CSV">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={loadPhotos} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={handleAdd} className="flex-shrink-0">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Photo</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          <p>Error fetching photos. Please try again.</p>
          <Button variant="outline" className="mt-2" onClick={loadPhotos}>
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {!loading && !error && photos.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium">No photos yet</h3>
          <p className="text-sm text-gray-500 mt-2">Add photos to display in the media gallery</p>
          <Button className="mt-4" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Photo
          </Button>
        </div>
      )}

      {!loading && !error && photos.length > 0 && (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {photos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((photo) => (
            <div key={photo.id} className={`bg-white rounded-lg border overflow-hidden group ${selectedIds.has(photo.id) ? 'ring-2 ring-red-300' : ''}`}>
              <div className="relative aspect-square bg-gray-100">
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(photo.id)}
                    onChange={() => toggleSelect(photo.id)}
                    className="h-4 w-4 rounded border-gray-300 bg-white cursor-pointer"
                  />
                </div>
                {!imageErrors[photo.id] ? (
                  <Image
                    src={photo.url}
                    alt={photo.caption || 'Gallery photo'}
                    fill
                    className="object-contain"
                    onError={() => setImageErrors((prev) => ({ ...prev, [photo.id]: true }))}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                {/* Hover overlay with actions (desktop) */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(photo)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDelete(photo.id)}
                    className="h-8 w-8 p-0 text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">
                  {photo.caption || 'No caption'}
                </p>
                {/* Mobile action buttons - icon only */}
                <div className="flex gap-1 mt-1 sm:hidden">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(photo)}
                    className="h-7 w-7 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(photo.id)}
                    className="h-7 w-7 p-0 text-red-600"
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {Math.ceil(photos.length / itemsPerPage) > 1 && (
          <div className="flex items-center justify-between bg-white rounded-lg border px-4 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); setSelectedIds(new Set()); const el = document.querySelector('[data-admin-scroll]'); if (el) el.scrollTop = 0; }}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(photos.length / itemsPerPage)} ({photos.length} total)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setCurrentPage((p) => Math.min(Math.ceil(photos.length / itemsPerPage), p + 1)); setSelectedIds(new Set()); const el = document.querySelector('[data-admin-scroll]'); if (el) el.scrollTop = 0; }}
              disabled={currentPage === Math.ceil(photos.length / itemsPerPage)}
            >
              Next
            </Button>
          </div>
        )}
        </>
      )}

      <GalleryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        photo={selectedPhoto}
        isCreating={isCreating}
        onSave={loadPhotos}
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
        title="Export Gallery Data"
        description="Enter your admin PIN to export gallery data."
        onVerified={handleExportCSV}
      />
    </div>
  );
}
