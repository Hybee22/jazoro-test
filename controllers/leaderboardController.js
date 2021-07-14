const LeaderBoard = require('../models/leaderboardModel')
const catchAsync = require('../utils/libs/catchAsync');

exports.getUserPoints = catchAsync(async (req, res, next) => {
    const data = await LeaderBoard.find().populate('user').populate('points')
    const leaderboardData = data.map(item => {
        return {
            user: item.user.username,
            point: item.points.points
        }
    })

    io.on('connect', socket => {
        socket.emit('leaderboard', { data: leaderboardData })
    })

    res.status(200).json({
        status: 'success',
        data: {
          data: leaderboardData,
        },
      });
})

exports.getLeaderPoints = async () => {
    const data = await LeaderBoard.find().populate('user').populate('points')
    const leaderboardData = data.map(item => {
        return {
            user: item.user.username,
            point: item.points.points
        }
    })

    io.on('connect', socket => {
        socket.emit('leaderboard', { data: leaderboardData })
    })

}