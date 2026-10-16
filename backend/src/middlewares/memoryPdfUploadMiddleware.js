import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const isPdfMime = file.mimetype === "application/pdf";
        const isPdfExt = file.originalname.toLowerCase().endsWith(".pdf");

        if (isPdfMime || isPdfExt) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF resume files are supported for auto-fill"), false);
        }
    }
});

const uploadResumeMemory = (req, res, next) => {
    const singleUpload = upload.single("resume");

    singleUpload(req, res, function (err) {
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }

        next();
    });
};

export default uploadResumeMemory;
