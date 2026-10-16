import { parseResumeBuffer } from "../services/resumeRagService.js";


// Controller to parse uploaded resume PDF and return extracted application fields

const parseResume = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }

        const extractedData = await parseResumeBuffer(req.file.buffer);

        return res.status(200).json({
            message: "Resume parsed successfully",
            data: extractedData
        });
    } catch (error) {
        console.error("Resume parsing error:", error);
        return res.status(500).json({
            message: error.message || "Failed to extract details from resume"
        });
    }
};

export default parseResume;
