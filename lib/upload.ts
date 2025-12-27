// Utility to upload files to Cloudinary via our API route

export async function uploadToCloudinary(
    file: File,
    folder: string = 'car-marketplace'
): Promise<{ url: string; public_id: string } | null> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const data = await response.json();
        return {
            url: data.url,
            public_id: data.public_id,
        };
    } catch (error) {
        console.error('Upload error:', error);
        return null;
    }
}

export async function uploadMultipleFiles(
    files: File[],
    folder: string = 'car-marketplace',
    onProgress?: (uploaded: number, total: number) => void
): Promise<string[]> {
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
        const result = await uploadToCloudinary(files[i], folder);
        if (result) {
            urls.push(result.url);
        }
        if (onProgress) {
            onProgress(i + 1, files.length);
        }
    }

    return urls;
}
