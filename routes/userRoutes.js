const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { updateProfile } = require('../controllers/userController');

router.put('/update', auth, upload.array('profilePic'), updateProfile);

module.exports = router;
