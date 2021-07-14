const mongoose = require('mongoose')

const leaderboardSchema = new mongoose.Schema(
    {
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'LeaderBoard must have to a user'],
    },
      points: {
        type: mongoose.Schema.ObjectId,
        ref: 'Point',
        required: [true, 'LeaderBoard must have to a user point'],
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

  const LeaderBoard = mongoose.model('LeaderBoard', leaderboardSchema);
  
  module.exports = LeaderBoard;


// user: {
//     type: mongoose.Schema.ObjectId,
//     ref: 'User',
//     required: [true, 'Review must belong to a user'],
//   },