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
        maxSizeMB: 1, // Max 1MB
        maxWidthOrHeight: 1920,
        useWebWorker: false, // Set to false to prevent Next.js browser hangs
    };

    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error('Compression error:', error);
        return file; // Fallback to original if compression fails
    }
}

/**
 * Uploads a single compressed file to Supabase Storage
 */
export async function uploadToSupabase(
    file: File,
    folder: string = 'public'
): Promise<string | null> {
    try {
        const supabase = createClient();

        // Generate a random UUID-based filename (safe and collision-free)
        const fileExtension = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${folder}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('car-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('car-images')
            .getPublicUrl(data.path);

        return publicUrl;
    } catch (error) {
        console.error('Upload error:', error);
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

    // returning only successful URLs
    return results.filter((url): url is string => url !== null);
}
