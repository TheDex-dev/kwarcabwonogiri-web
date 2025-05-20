import ImageKit from 'imagekit-javascript';

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    authenticationEndpoint: '/api/imagekit'
});

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB limit
const ALLOWED_VIDEO_TYPES = [
    'video/mp4',
    'video/webm',
    'video/ogg'
];

export async function uploadVideo(file) {
    try {
        // Validate file type
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            throw new Error(`Invalid file type. Allowed types: ${ALLOWED_VIDEO_TYPES.join(', ')}`);
        }

        // Validate file size
        if (file.size > MAX_VIDEO_SIZE) {
            throw new Error(`File too large. Maximum size is ${MAX_VIDEO_SIZE / 1024 / 1024}MB`);
        }

        // Get authentication parameters
        const authResponse = await fetch('/api/imagekit');
        if (!authResponse.ok) {
            throw new Error('Failed to get upload authentication');
        }
        const { token, signature, expire } = await authResponse.json();

        // Convert video file to base64
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const base64Data = reader.result.split(',')[1];
                    if (!base64Data) {
                        reject(new Error('Failed to convert file to base64'));
                        return;
                    }
                    resolve(base64Data);
                } catch (error) {
                    reject(new Error('Failed to process file: ' + error.message));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
        
        // Generate a timestamp for the filename
        const timestamp = new Date().getTime();
        const fileName = `${timestamp}-${file.name}`;

        const uploadOptions = {
            file: base64,
            fileName,
            useUniqueFileName: true,
            folder: '/videos',
            tags: ['video'],
            // Authentication parameters
            token,
            signature,
            expire,
            // Metadata
            customMetadata: {
                originalName: file.name,
                fileType: file.type,
                uploadDate: new Date().toISOString(),
                fileSize: file.size.toString()
            }
        };

        const result = await imagekit.upload(uploadOptions);

        if (!result.url) {
            throw new Error('Video upload failed - no URL returned');
        }

        return {
            url: result.url,
            fileId: result.fileId,
            name: result.name,
            size: result.size,
            filePath: result.filePath,
            thumbnailUrl: result.thumbnailUrl // ImageKit automatically generates video thumbnails
        };
    } catch (error) {
        console.error('ImageKit Video Upload Error:', error);
        throw new Error('Failed to upload video: ' + error.message);
    }
}

export async function deleteVideo(fileId) {
    try {
        await imagekit.deleteFile(fileId);
        return true;
    } catch (error) {
        console.error('ImageKit Video Delete Error:', error);
        throw new Error('Failed to delete video: ' + error.message);
    }
}

export async function getVideoDetails(fileId) {
    try {
        const details = await imagekit.getFileDetails(fileId);
        return {
            url: details.url,
            fileId: details.fileId,
            name: details.name,
            size: details.size,
            filePath: details.filePath,
            thumbnailUrl: details.thumbnailUrl,
            metadata: details.customMetadata
        };
    } catch (error) {
        console.error('ImageKit Video Details Error:', error);
        throw new Error('Failed to get video details: ' + error.message);
    }
}
