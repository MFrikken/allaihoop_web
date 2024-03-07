const fs = require('fs');
const multer = require('../routes/multerConfig');

const shortTimeStorage = multer.shortTimeStorage;

const getImageFromShortTime = async (filename) => {
    const filepath = shortTimeStorage + filename;

    try {
        return await fs.readFileSync(filepath);
    } catch (e) {
        console.log("Error loading the image by filename: " + e);
    }
};

const checkImage = async (filename) => {
    const filepath = shortTimeStorage + filename;

    try {
        if (fs.existsSync(filepath)) {
            return true;
        } else return false;
    } catch (e) {
        console.log("Error finding the image by filename: " + e);
    }
};

module.exports = { getImageFromShortTime, checkImage }