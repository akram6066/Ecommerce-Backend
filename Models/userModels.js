const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: { type: String,  default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"},
  userType: {
    type: String,
    enum: ["User", "Admin", "Delivery"],
    default: "User"
  }
},
{
  timestamps:true,
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true }
}
);

const User = mongoose.model('User', userSchema);

module.exports = User;
