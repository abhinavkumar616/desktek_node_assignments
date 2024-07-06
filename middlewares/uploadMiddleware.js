const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    file.originalnameWithTimestamp = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, file.originalnameWithTimestamp);
  },
});

const upload = multer({ storage });

module.exports = upload;
