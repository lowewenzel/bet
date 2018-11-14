const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const UserSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  username: {
    type: String, unique: true, required: true, uniqueCaseInsensitive: true,
  },
  password: { type: String, required: true, select: false },
  fbUsername: { type: String }, // facebook
  igUsername: { type: String }, // instagram
  twUsername: { type: String }, // twitter
  scUsername: { type: String }, // snapchat
  // isAdmin: { type: Boolean, default: false }, // Admin Privileges(CRUD users)
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function createUser(next) {
  // Make createdAt and updatedAt
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }

  // Password Encryption
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (othererr, hash) => {
      user.password = hash;
      next();
    });
  });
  return null;
});

UserSchema.pre('update', function updateTime() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

UserSchema.methods.comparePassword = function hashPass(password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
