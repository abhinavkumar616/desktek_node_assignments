const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  const { name, gender, technology, dob, profilePic,referralCode } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.name = name || user.name;
    user.gender = gender || user.gender;
    user.technology = technology || user.technology;
    user.dob = dob || user.dob;
    user.referralCode = referralCode || user.referralCode;

    if (req.files && req.files.length > 0) {
      const uploadedPics = req.files.map(file => file.originalnameWithTimestamp);
      user.profilePic = uploadedPics;
    } else if (profilePic) {
      user.profilePic = Array.isArray(profilePic) ? profilePic : [profilePic];
    }

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
