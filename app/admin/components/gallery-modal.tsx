'use client';

import { useState, useEffect } from 'react';
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
import { Loader2, AlertTriangle } from 'lucide-react';
import { PinDialog } from '@/components/ui/pin-dialog';
import { createGalleryPhoto, updateGalleryPhoto } from '@/lib/actions/gallery-actions';
import { GalleryPhoto } from '@/types';

interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  photo: GalleryPhoto | null;
  isCreating: boolean;
  onSave: () => void;
}

export default function GalleryModal({ open, onClose, photo, isCreating, onSave }: GalleryModalProps) {
  const [formUrl, setFormUrl] = useState('');
  const [formCaption, setFormCaption] = useState('');
  const [formOrder, setFormOrder] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (photo && !isCreating) {
      setFormUrl(photo.url);
      setFormCaption(photo.caption || '');
      setFormOrder(String(photo.sortOrder || 0));
    } else {
      setFormUrl('');
      setFormCaption('');
      setFormOrder('0');
    }
    setErrorMessage('');
  }, [photo, isCreating, open]);

  const handleSubmitClick = () => {
    setErrorMessage('');
    if (!formUrl.trim()) {
      setErrorMessage('Image URL is required.');
      return;
    }

    setShowPinDialog(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let res;
      if (isCreating) {
        res = await createGalleryPhoto({
          url: formUrl.trim(),
          caption: formCaption.trim() || undefined,
          sortOrder: parseInt(formOrder) || 0,
        });
      } else if (photo) {
        res = await updateGalleryPhoto(photo.id, {
          url: formUrl.trim(),
          caption: formCaption.trim() || undefined,
          sortOrder: parseInt(formOrder) || 0,
        });
      }

      if (res && 'error' in res) {
        setErrorMessage(res.error || 'Failed to save photo.');
      } else if (res) {
        onSave();
        onClose();
      } else {
        setErrorMessage('Failed to save photo.');
      }
    } catch (error) {
      console.error('Save error:', error);
      setErrorMessage('Failed to save photo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isCreating ? 'Add New Photo' : 'Edit Photo'}</DialogTitle>
          <DialogDescription>
            {isCreating ? 'Enter the details for the new gallery photo' : 'Update the photo details'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="gallery-url">Image URL *</Label>
            <Input
              id="gallery-url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the full URL of the image.
            </p>
          </div>

          <div>
            <Label htmlFor="gallery-caption">Caption</Label>
            <Input
              id="gallery-caption"
              value={formCaption}
              onChange={(e) => setFormCaption(e.target.value)}
              placeholder="Photo description (optional)"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="gallery-order">Sort Order</Label>
            <Input
              id="gallery-order"
              type="number"
              value={formOrder}
              onChange={(e) => setFormOrder(e.target.value)}
              className="mt-1 w-24"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          {/* Preview */}
          {formUrl && (
            <div>
              <Label>Preview</Label>
              <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden mt-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}
        </div>

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
          <Button onClick={handleSubmitClick} disabled={isSubmitting || !formUrl.trim()}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : isCreating ? (
              'Add Photo'
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      <PinDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        title={isCreating ? 'Confirm Add Photo' : 'Confirm Edit Photo'}
        description="Enter your admin PIN to save this photo."
        onVerified={handleSubmit}
        loading={isSubmitting}
      />
    </Dialog>
  );
}
