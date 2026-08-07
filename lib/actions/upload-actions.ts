'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import {
  getCloudinaryConfig,
  signUploadParams,
  UPLOAD_FOLDERS,
  type UploadFolder,
} from '@/lib/cloudinary';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export interface UploadTicket {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  folder: string;
}

/**
 * Issues a signed, short-lived ticket authorising one upload into a fixed
 * folder. Admin-gated: without this check any visitor could mint upload
 * credentials for the account.
 *
 * The API secret is never returned — only the signature derived from it. The
 * signature covers `folder` and `timestamp`, so the client cannot redirect the
 * upload elsewhere or replay it indefinitely (Cloudinary rejects timestamps
 * outside roughly an hour).
 */
export async function getUploadTicket(
  folder: UploadFolder,
): Promise<UploadTicket | { error: string }> {
  const admin = await isAdmin();
  if (!admin) return { error: 'Authentication required' };

  const config = getCloudinaryConfig();
  if (!config) {
    return {
      error:
        'Image uploads are not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, then redeploy. You can paste an image URL instead in the meantime.',
    };
  }

  const targetFolder = UPLOAD_FOLDERS[folder];
  if (!targetFolder) return { error: 'Unknown upload folder' };

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signUploadParams(
    { folder: targetFolder, timestamp },
    config.apiSecret,
  );

  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    timestamp,
    signature,
    folder: targetFolder,
  };
}

/** Lets the admin UI show the upload button only when it will actually work. */
export async function isUploadConfigured(): Promise<boolean> {
  return getCloudinaryConfig() !== null;
}
