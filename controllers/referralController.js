const User = require('../models/User');
const Form = require('../models/Form');

exports.saveFormData = async (req, res) => {
  const { name, mobile, referralCode, gender, technology, dob, profilePic } = req.body;

  try {
    // Find the logged-in user
    const user = await User.findById(req.user.id);
    console.log("tokenUser",user._id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Validate required fields
    if (!name || !mobile) {
      return res.status(400).json({ error: "Name and Mobile are required fields" });
    }

    // Check if form with the same mobile number already exists
    let existingForm = await Form.findOne({ mobile });
    if (existingForm) {
      return res.status(400).json({ error: 'Form with this mobile number already exists' });
    }

    // Initialize profilePic array if not provided
    const profilePics = profilePic ? [profilePic] : [];

    // Handle profile pictures
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        profilePics.push(file.originalname); // Store original file names in profilePics array
      });
    }

    let referCode=await User.findOne({_id:user._id, referralCode})

    if(!referCode){
      return res.status(400).json({ error: 'Invalid referral code' });
    }

    console.log("referCode-------",referCode);
    
    referCode.points=referCode.points+20;
    let formPoint=10;

    // Save the updated points for the user
    await User.findByIdAndUpdate(user._id, { points: referCode.points });


    // Create a new Form instance
    const newForm = new Form({
      name,
      mobile,
      referralCode,
      gender,
      technology,
      dob,
      profilePic: profilePics, // Assign profilePics array
      points: formPoint, // Assign points from the user
      creator: user._id // Assign the creator's _id from the logged-in user
    });

    // Save the form
    await newForm.save();

    // Update user's forms array to include this form
    user.forms.push(newForm._id);
    await user.save();

    res.json(newForm);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};



exports.getReferralList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await Form.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Form.countDocuments();
    res.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteReferralUser = async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
