const Point = require('../models/pointModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/libs/catchAsync');
const AppError = require('../utils/libs/appError');
// const { getLeaderPoints } = require('./leaderboardController');

exports.updatePoints = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.body.userId });

    if (!user) {
        return next(new AppError('User is inactive', 400));
    }

    const doc = await Point.findOneAndUpdate({ userId: req.body.userId }, { points: req.body.points }).populate('user')

    // Emit Event
    const eventEmitter = req.app.get('eventEmitter')
    eventEmitter.emit('updatePoints', { id: user._id, user: user.username, point: req.body.points })

    res.status(200).json({
        status: 'success',
        message: `User ${user.username}'s points updated successfully`,
        data: {
          data: doc,
        },
      });

})