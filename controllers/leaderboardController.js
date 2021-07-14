const LeaderBoard = require('../models/leaderboardModel')

exports.getLeaderPoints = async () => {
    const data = await LeaderBoard.find().populate('user').populate('points')
    const leaderboardData = data.map(item => {
        return {
            id: item.user._id,
            user: item.user.username,
            point: item.points.points
        }
    })


    return leaderboardData
}