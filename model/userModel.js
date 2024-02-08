const mongoose = require('mongoose');
const slugify = require('slugify');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'only email'],
    trim: true,
  },
  role: {
    type: String,
    default: 'viewer',
  },
  password: {
    type: String,
    required: [true, 'please provide your password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'password not matched, confirm again',
    },
  },
  passwordChangeedAt: Date,

  createdAt: {
    type: Date,
    default: new Date(Date.now()),
    select: false,
  },
  slug: String,
});

userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Hasing user password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// Login password compaing between user and bcrypt

userSchema.methods.loginCorrectPasswrd = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangeAt = function (jwtTimeStmp) {
  if (this.passwordChangeedAt) {
    const changedTimeStmp = parseInt(
      this.passwordChangeedAt.getTime() / 1000,
      10,
    );

    return changedTimeStmp > jwtTimeStmp;
  }
  return false;
};

// used for when search for user only active user shoud show.
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const user = mongoose.model('User', userSchema);

module.exports = user;
