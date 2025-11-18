import { gridfsBucket } from "../config/db.js";
import { Readable } from "stream";

export const uploadImageToGridFS = (buffer, filename) => {
    return new Promise((resolve, reject) => {
        if (!gridfsBucket) {
            return reject(new Error("GridFS bucket not initialized"));
        }

        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);

        const uploadStream = gridfsBucket.openUploadStream(filename, {
            contentType: "image/jpeg",
        });

        readable.pipe(uploadStream);

        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", (err) => reject(err));
    });
};
