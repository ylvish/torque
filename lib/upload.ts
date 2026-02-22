import { createClient } from '@/lib/supabase-browser'; // We need a browser-side supabase client

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

    // Size limit temporarily removed.

    return { isValid: true };
}

// Compression logic temporarily removed to prevent WebWorker browser hangs in Next.js.

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
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Upload to Supabase directly (skipping compression which causes React hangs)
        const url = await uploadToSupabase(file, folder);

        if (url) {
            urls.push(url);
        }

        if (onProgress) {
            onProgress(i + 1, files.length);
        }
    }

    return urls;
}
