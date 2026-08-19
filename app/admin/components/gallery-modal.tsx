'use client';

import { useState } from 'react';
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
import ImageUpload from '@/components/admin/ImageUpload';

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
  const [formFeatured, setFormFeatured] = useState(false);
  const [formFocalY, setFormFocalY] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset the form when the modal opens or targets a different photo. Adjusted
  // during render rather than in an effect (see components/Header.tsx for the
  // same pattern) so the fields never show the previous photo's values for a
  // frame. Comparing by reference preserves the original effect's semantics.
  const [prevDeps, setPrevDeps] = useState({ photo, isCreating, open });
  if (prevDeps.photo !== photo || prevDeps.isCreating !== isCreating || prevDeps.open !== open) {
    setPrevDeps({ photo, isCreating, open });
    if (photo && !isCreating) {
      setFormUrl(photo.url);
      setFormCaption(photo.caption || '');
      setFormOrder(String(photo.sortOrder || 0));
      setFormFeatured(photo.featuredOnHome ?? false);
      setFormFocalY(photo.focalY ?? 50);
    } else {
      setFormUrl('');
      setFormCaption('');
      setFormOrder('0');
      setFormFeatured(false);
      setFormFocalY(50);
    }
    setErrorMessage('');
  }

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
          featuredOnHome: formFeatured,
          focalY: formFocalY,
        });
      } else if (photo) {
        res = await updateGalleryPhoto(photo.id, {
          url: formUrl.trim(),
          caption: formCaption.trim() || undefined,
          sortOrder: parseInt(formOrder) || 0,
          featuredOnHome: formFeatured,
          focalY: formFocalY,
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
            <Label htmlFor="gallery-url">Image *</Label>
            <ImageUpload
              folder="gallery"
              label="Upload from your computer"
              className="mt-2"
              onUploaded={(url) => {
                setFormUrl(url);
                setErrorMessage('');
              }}
            />
            <Input
              id="gallery-url"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload a file, or paste an image URL directly.
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

          {/* Homepage grid controls */}
          <div className="border-t pt-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formFeatured}
                onChange={(e) => setFormFeatured(e.target.checked)}
                className="mt-1 h-4 w-4 accent-green-700"
              />
              <span>
                <span className="text-sm font-medium">Show on the homepage</span>
                <span className="block text-xs text-gray-500">
                  Adds this photo to the &ldquo;Abolitionists at Work&rdquo; grid. The grid holds six
                  photos &mdash; the six lowest sort orders are used, so lower the sort order to
                  swap a photo in.
                </span>
              </span>
            </label>

            {formFeatured && (
              <div className="mt-3">
                <Label htmlFor="gallery-focal">Vertical crop position</Label>
                <input
                  id="gallery-focal"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={formFocalY}
                  onChange={(e) => setFormFocalY(Number(e.target.value))}
                  className="mt-2 w-full accent-green-700"
                />
                <p className="text-xs text-gray-500 mt-1">
                  The homepage tiles are a fixed shape, so tall photos get cropped top and bottom.
                  Drag right if the important part &mdash; usually the sign &mdash; sits low in the
                  frame. Currently {formFocalY}%.
                </p>
              </div>
            )}
          </div>

          {/* Preview. When the photo is headed for the homepage this mirrors the real
              tile -- same 4:3 ratio, same object-cover, same focal point -- so what gets
              cut off is visible here instead of after publishing. */}
          {formUrl && (
            <div>
              <Label>{formFeatured ? 'Homepage tile preview' : 'Preview'}</Label>
              <div
                className={`relative bg-gray-100 rounded-lg overflow-hidden mt-1 ${
                  formFeatured ? 'w-full aspect-[4/3]' : 'w-32 h-32'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  style={formFeatured ? { objectPosition: `center ${formFocalY}%` } : undefined}
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
