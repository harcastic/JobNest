import upload from "./resUploadMiddleware.js";

const uploadResume = (req, res, next) => {
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

export default uploadResume;