import { createClient } from '@/lib/supabase-browser'; // We need a browser-side supabase client
import imageCompression from 'browser-image-compression';

/**
 * Validates a file before compressing/uploading.
 * - Under 10MB
 * - Is an image (jpg, jpeg, png, webp)
 */
export function validateImage(file: File): { isValid: boolean; error?: string } {
    const MAX_SIZE_MB = 10;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        return { isValid: false, error: 'Only JPG, PNG, and WebP formats are allowed.' };
    }

    if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
        return { isValid: false, error: `File must be smaller than ${MAX_SIZE_MB}MB.` };
    }

    return { isValid: true };
}

/**
 * Compresses an image file before upload
 */
export async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 0.8, // Slightly reduced to speed up compression
        maxWidthOrHeight: 1600, // Reduced from 1920 for faster processing
        useWebWorker: true, // Re-enabled WebWorkers to move compression off the main thread
        initialQuality: 0.8,
    };

    try {
        console.time(`Compressing ${file.name}`);
        const compressed = await imageCompression(file, options);
        console.timeEnd(`Compressing ${file.name}`);
        console.log(`Size reduced from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressed.size / 1024 / 1024).toFixed(2)}MB`);
        return compressed;
    } catch (error) {
        console.error('Compression error:', error);
        return file; // Fallback to original if compression fails
    }
}

/**
 * Uploads a single compressed file to Supabase Storage
 */
export async function uploadToSupabase(
    file: File | Blob,
    folder: string = 'public'
): Promise<string | null> {
    try {
        console.log('[Upload] Starting uploadToSupabase');
        const supabase = createClient();
        console.log('[Upload] Supabase client created');

        // Extracting name safely in case it is a Blob
        const originalName = (file as File).name || 'image.jpg';
        const fileExtension = originalName.split('.').pop() || 'jpg';

        console.log('[Upload] Generating UUID for', originalName);
        const randomId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7);
        const fileName = `${randomId}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        console.log(`[Upload] Attempting to upload ${filePath} to 'car-images' bucket...`);
        console.time(`[Upload Time] ${fileName}`);

        // Convert File to ArrayBuffer to prevent Fetch stream hangs with WebWorker blobs
        const buffer = await file.arrayBuffer();

        const { data, error } = await supabase.storage
            .from('car-images')
            .upload(filePath, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        console.timeEnd(`[Upload Time] ${fileName}`);
        console.log('[Upload] Supabase response received', { data, error });

        if (error) {
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('car-images')
            .getPublicUrl(data.path);

        console.log('[Upload] Got public URL:', publicUrl);
        return publicUrl;
    } catch (error) {
        console.error('[Upload] Upload error inside uploadToSupabase:', error);
        return null;
    }
}

/**
 * Main utility used by pages to validate, and upload multiple files
 */
export async function uploadMultipleFiles(
    files: File[],
    folder: string = 'public',
    onProgress?: (uploaded: number, total: number) => void
): Promise<string[]> {
    console.log(`Starting upload of ${files.length} files...`);
    console.time('Total Upload Time');

    let completed = 0;

    // Upload in parallel
    const uploadPromises = files.map(async (file) => {
        // 1. Compress
        const compressedFile = await compressImage(file);

        // 2. Upload to Supabase 
        const url = await uploadToSupabase(compressedFile, folder);

        if (onProgress) {
            completed++;
            onProgress(completed, files.length);
        }

        return url;
    });

    const results = await Promise.all(uploadPromises);
    console.timeEnd('Total Upload Time');

    // returning only successful URLs
    return results.filter((url): url is string => url !== null);
}
