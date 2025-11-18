import { uploadImageToGridFS } from "../utils/gridfsUpload.js";

export const uploadChallengeBanner = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: "No banner image provided" });
        }

        const fileId = await uploadImageToGridFS(
            req.file.buffer,
            req.file.originalname || `challenge-banner-${Date.now()}.jpg`
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
