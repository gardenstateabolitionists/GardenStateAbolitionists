'use client';

import { useState, useRef, useEffect, useId } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { verifyPin } from '@/lib/actions/pin-actions';
import { Loader2, ShieldCheck } from 'lucide-react';

interface PinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  onVerified: () => void;
  loading?: boolean;
}

export function PinDialog({ open, onOpenChange, title, description, onVerified, loading }: PinDialogProps) {
  const inputId = useId();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setPin('');
      setError('');
      setVerifying(false);
      // Auto-focus the input after dialog renders
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim() || verifying || loading) return;

    setError('');
    setVerifying(true);

    try {
      const result = await verifyPin(pin);
      if (result.valid) {
        onOpenChange(false);
        onVerified();
      } else {
        setError(result.error);
        setPin('');
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    } catch {
      setError('Verification failed. Please try again.');
      setPin('');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-red-600" />
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
              Enter 4-digit admin PIN
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPin(val);
                setError('');
              }}
              placeholder="••••"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={verifying || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pin.length !== 4 || verifying || loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {verifying || loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
