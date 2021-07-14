const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please tell us your name.'],
      },
      email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
        lowercase: true,
        validate: {
          validator: function (el) {
            return validator.isEmail(el);
          },
          message: 'Please provide a valid email',
        },
      },
      password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 8,
        select: false,
      },
      passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
          validator: function (el) {
            return el === this.password;
          },
          message: 'Passwords do not match',
        },
      },
    },
    {
      toObject: {
        virtuals: true,
      },
      toJSON: {
        virtuals: true,
      },
    }
  );

  
userSchema.pre('save', async function (next) {
    // If password was modified
    if (!this.isModified('password')) return next();
  
    // Hash Password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
    // Remove password confirm from being persisted
    this.passwordConfirm = undefined;
  
    next();
  });
  
  userSchema.methods.correctPassword = function (
    candidatePassword,
    userPassword
  ) {
    return bcrypt.compare(candidatePassword, userPassword);
  };
    
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;