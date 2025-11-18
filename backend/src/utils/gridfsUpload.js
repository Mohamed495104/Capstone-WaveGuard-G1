import { gridfsBucket } from "../config/db.js";
import { Readable } from "stream";
import sharp from "sharp";

/**
 * Upload and compress image to GridFS
 * @param {Buffer} buffer - Image buffer
 * @param {string} filename - Filename for the image
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width in pixels (default: 1200)
 * @param {number} options.quality - JPEG quality 1-100 (default: 85)
 * @returns {Promise<ObjectId>} - GridFS file ID
 */
export const uploadImageToGridFS = async (buffer, filename, options = {}) => {
    const { maxWidth = 1200, quality = 85 } = options;

    if (!gridfsBucket) {
        throw new Error("GridFS bucket not initialized");
    }

    try {
        // Compress image using sharp
        const compressedBuffer = await sharp(buffer)
            .resize(maxWidth, null, { 
                withoutEnlargement: true, // Don't upscale smaller images
                fit: 'inside' 
            })
            .jpeg({ quality, mozjpeg: true })
            .toBuffer();

        // Upload compressed image to GridFS
        return new Promise((resolve, reject) => {
            const readable = new Readable();
            readable.push(compressedBuffer);
            readable.push(null);

            const uploadStream = gridfsBucket.openUploadStream(filename, {
                contentType: "image/jpeg",
            });

            readable.pipe(uploadStream);

            uploadStream.on("finish", () => resolve(uploadStream.id));
            uploadStream.on("error", (err) => reject(err));
        });
    } catch (error) {
        throw new Error(`Image compression failed: ${error.message}`);
    }
};
