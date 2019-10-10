const mongoose = require('mongoose');
const randomWords = require('random-words');

const { Schema } = mongoose;

const BetSchema = new Schema({
  createdAt: { type: Date },
  updatedAt: { type: Date },
  betDescription: {
    type: String,
    required: true
  },
  betValue: {
    type: Number,
    require: true
  },
  userA: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userB: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completed: {
    type: Boolean
  },
  completionProgress: {
    type: Schema.Types.Mixed
  },
  slug: {
    type: String
  }
});

/*
  completionProgress: {
    stage: 0 - incomplete, no winner
           1 - one participant marked a winner
           2 - both chose same winner
  }


*/

BetSchema.pre('save', function createUser(next) {
  // Make createdAt and updatedAt
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    const randomSlug = randomWords({
      exactly: 1,
      wordsPerString: 4,
      separator: '-'
    })[0];
    console.log(randomSlug);

    this.createdAt = now;
    this.completed = false;
    this.slug = randomSlug;
    this.completionProgress = {
      stage: 0, // Int
      winner: null, // User Object
      firstMarker: null // Email
    };
  }
  next();
});

BetSchema.pre('update', function updateTime() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model('Bet', BetSchema);
