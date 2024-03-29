const multer = require('multer');

const shortTimeStorage = "/home/mfrikken/WebstormProjects/allaihoop_web/backend/data/shortTimeStorage/";

// multer setup
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, shortTimeStorage);
    },
    filename: function(req, file, cb) {
        const date = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '');
        const fieldname = file.originalname.split(".")[0];
        const fileExtension = file.originalname.split(".").pop();
        const fileName = `${fieldname}-${date}.${fileExtension}`;
        cb(null, fileName);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
});

module.exports = { upload, shortTimeStorage };