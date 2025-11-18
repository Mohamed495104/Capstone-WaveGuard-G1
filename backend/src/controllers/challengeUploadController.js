import { uploadImageToGridFS } from "../utils/gridfsUpload.js";

export const uploadChallengeBanner = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "No banner image provided" });
        }

        // Upload with higher quality for challenge banners
        const fileId = await uploadImageToGridFS(
            req.file.buffer,
            req.file.originalname || `challenge-banner-${Date.now()}.jpg`,
            { maxWidth: 1920, quality: 90 } // Higher quality for banners
        );

        return res.json({
            bannerImage: `/api/images/${fileId}`,
            message: "Banner uploaded successfully"
        });

    } catch (error) {
        console.error("Banner upload error:", error);
        res.status(500).json({ message: "Failed to upload banner" });
    }
};
