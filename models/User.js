const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  mobile: { 
    type: String, 
    required: true, 
    unique: true 
},
  referralCode: { 
    type: String
},
  gender: { 
    type: String, 
    enum: ['Male', 'Female'] 
},
  technology: { 
    type: [String], 
    enum: ['PHP', 'Angular', 'Nodejs'] 
},
  profilePic: { 
    type: [String] 
},
  dob: { 
    type: Date 
},
  points: { 
    type: Number, 
    default: 0 
},
  password: { 
    type: String, 
    required: true 
},

forms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Form' }] // Reference to forms created by this user

});

// Hash password before saving
userSchema.pre('save', async function (next) {
  try {
      if (!this.isModified('password')) {
          return next();
      }

      // Password complexity validation
      if (!isValidPassword(this.password)) {
          return next(new Error("Password must contain at least 10 characters including at least one special character, one lowercase letter, one uppercase letter, and one digit."));
      }

      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      return next();
  } catch (error) {
      return next(error);
  }
});

// Function to validate password complexity
function isValidPassword(password) {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[a-zA-Z]).{10,}$/;
  return passwordRegex.test(password);
}

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) 
//     return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

module.exports = mongoose.model('Destek', userSchema);
