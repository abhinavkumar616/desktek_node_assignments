const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { saveFormData, getReferralList, deleteReferralUser } = require('../controllers/referralController');


router.post('/save', auth, upload.array('profilePic'),saveFormData);
router.get('/list', auth, getReferralList);
router.delete('/delete/:id', auth, deleteReferralUser);

module.exports = router;
