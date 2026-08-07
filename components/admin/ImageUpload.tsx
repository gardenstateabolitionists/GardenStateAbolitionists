'use client';

import { useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUploadTicket } from '@/lib/actions/upload-actions';
import {
  ALLOWED_UPLOAD_TYPES,
  MAX_UPLOAD_BYTES,
  type UploadFolder,
} from '@/lib/cloudinary';

interface ImageUploadProps {
  folder: UploadFolder;
  /** Called with the secure Cloudinary URL once the upload completes. */
  onUploaded: (url: string) => void;
  label?: string;
  className?: string;
}

/**
 * Uploads an image straight from the browser to Cloudinary using a signed
 * ticket minted server-side. The file never passes through our own server, so
 * it isn't bound by the serverless request-body limit.
 *
 * Degrades honestly: if Cloudinary isn't configured the server action says so
 * and the message is surfaced, leaving the existing paste-a-URL field as the
 * working path rather than presenting a button that silently does nothing.
 */
export default function ImageUpload({
  folder,
  onUploaded,
  label = 'Upload image',
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setError('');

    if (!ALLOWED_UPLOAD_TYPES.includes(file.type)) {
      setError('Use a JPG, PNG, WebP, AVIF or GIF image.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      const mb = (file.size / 1024 / 1024).toFixed(1);
      setError(`That image is ${mb}MB. The limit is 10MB — resize it and try again.`);
      return;
    }

    setBusy(true);
    try {
      const ticket = await getUploadTicket(folder);
      if ('error' in ticket) {
        setError(ticket.error);
        return;
      }

      const body = new FormData();
      body.append('file', file);
      body.append('api_key', ticket.apiKey);
      body.append('timestamp', String(ticket.timestamp));
      body.append('signature', ticket.signature);
      body.append('folder', ticket.folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${ticket.cloudName}/image/upload`,
        { method: 'POST', body },
      );

      if (!res.ok) {
        // Cloudinary returns a useful reason (bad signature, quota, file type)
        // — surface it rather than a generic failure.
        let detail = '';
        try {
          const payload = await res.json();
          detail = payload?.error?.message ? ` — ${payload.error.message}` : '';
        } catch {
          /* response wasn't JSON; fall through to the status code */
        }
        setError(`Upload failed (${res.status})${detail}`);
        return;
      }

      const data = await res.json();
      if (!data.secure_url) {
        setError('Upload succeeded but Cloudinary returned no URL.');
        return;
      }
      onUploaded(data.secure_url as string);
    } catch {
      setError('Upload failed. Check your connection and try again.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_UPLOAD_TYPES.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {label}
          </>
        )}
      </Button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
