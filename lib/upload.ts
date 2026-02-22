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
    // Skip compression if file is already less than 500KB
    if (file.size < 500 * 1024) {
        console.log(`[Upload] Skipping compression for ${file.name} as it is only ${(file.size / 1024).toFixed(0)}KB`);
        return file;
    }

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
        return compressed as File;
    } catch (error) {
        console.error('Compression error:', error);
        return file; // Fallback to original if compression fails
    }
}

/**
 * Uploads a single compressed file to Supabase Storage
 * By-passes `supabase-js` fetch and auth deadlocks using raw XMLHttpRequest
 */
export async function uploadToSupabase(
    file: File | Blob,
    folder: string = 'public',
    supabaseClient?: any
): Promise<string | null> {
    try {
        console.log('[Upload] Starting uploadToSupabase');
        const supabase = supabaseClient || createClient();

        // Extracting name safely in case it is a Blob
        const originalName = (file as File).name || 'image.jpg';
        const fileExtension = originalName.split('.').pop() || 'jpg';

        console.log('[Upload] Generating UUID for', originalName);
        const randomId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7);
        const fileName = `${randomId}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase ENV vars missing');
        }

        console.log(`[Upload] Attempting to upload ${filePath} to 'car-images' bucket via raw XHR...`);
        console.time(`[Upload Time] ${fileName}`);

        // 1. Try to get auth token without hanging indefinitely (500ms timeout)
        let token = supabaseAnonKey;
        try {
            const sessionPromise = supabase.auth.getSession();
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 500));
            const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
            if (session?.access_token) {
                token = session.access_token;
            }
        } catch (e) {
            console.warn('[Upload] Auth getSession timed out (deadlock protected). Falling back to anon key.');
        }

        // 2. Perform raw XMLHttpRequest to completely bypass buggy fetch() polyfills and hanging streams
        const uploadEndpoint = `${supabaseUrl}/storage/v1/object/car-images/${filePath}`;

        const publicUrl = await new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', uploadEndpoint, true);

            // Required Supabase Headers
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.setRequestHeader('apikey', supabaseAnonKey);
            xhr.setRequestHeader('x-upsert', 'false');
            xhr.setRequestHeader('cache-control', '3600');
            xhr.setRequestHeader('Content-Type', file.type || 'image/jpeg');

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    // Success, calculate the public URL
                    const finalUrl = `${supabaseUrl}/storage/v1/object/public/car-images/${filePath}`;
                    resolve(finalUrl);
                } else {
                    reject(new Error(`Upload failed: ${xhr.status} ${xhr.responseText}`));
                }
            };

            xhr.onerror = () => reject(new Error('XHR Network Error during upload'));
            xhr.send(file);   // Native browser file blob stream
        });

        console.timeEnd(`[Upload Time] ${fileName}`);
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

    // Create ONE instance of the Supabase client for all uploads in this batch
    // This prevents parallel instances fighting over auth lock in localStorage
    const supabase = createClient();

    // Upload in parallel
    const uploadPromises = files.map(async (file) => {
        // 1. Compress
        const compressedFile = await compressImage(file);

        // 2. Upload to Supabase 
        const url = await uploadToSupabase(compressedFile, folder, supabase);

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
