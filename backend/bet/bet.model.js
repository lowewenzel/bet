const mongoose = require('mongoose');

const { Schema } = mongoose;

const BetSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  betDescription: {
    type: String, required: true,
  },
  betValue: {
    type: Number, require: true,
  },
  userA: {
    type: Schema.Types.ObjectId, ref: 'User', required: true
  },
  userB: {
    type: Schema.Types.ObjectId, ref: 'User', required: true
  },
  completed: {
    type: Boolean
  }
});

BetSchema.pre('save', function createUser(next) {
  // Make createdAt and updatedAt
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
    this.completed = false;
  }
  next();
});

BetSchema.pre('update', function updateTime() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model('Bet', BetSchema);
