const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, 'please add a name'] },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'please enter a valied email',
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, 'password must have more that 6 characters,'],
      // maxLength: [50, 'password must have less than 12 characters,'],
    },
    photo: {
      type: String,
      required: [true, 'please add a photo'],
      default: 'https://i.ibb.co/4pDNDK1/avatar.png',
    },
    phone: { type: String, default: '+254' },
    bio: {
      type: String,
      maxLength: [350, 'bio must not be more than 250 chars'],
      default: 'bio',
    },
  },
  {
    timestamps: true,
  }
);

//encrypt the password before saving to db
userSchema.pre("save", async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
})



const User = mongoose.model('User', userSchema);
module.exports = User;
