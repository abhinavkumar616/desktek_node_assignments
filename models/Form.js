const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
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

creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the user who created this form

});

module.exports = mongoose.model('formdata', FormSchema);