const mongoose = require('mongoose')

const pointSchema = new mongoose.Schema(
    {
      userId: {
        type: String,
        required: [true, 'User ID is required.'],
      },
      points: {
        type: Number,
        default: 0,
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

  const Point = mongoose.model('Point', pointSchema);
  
  module.exports = Point;