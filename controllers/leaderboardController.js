const LeaderBoard = require('../models/leaderboardModel')

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