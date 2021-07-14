const dotenv = require('dotenv');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

// UNCAUGHT EXCEPTIONS
// Application needs to be crashed then a tool will be needed to restart the APP
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!...');
  console.log(err.name, err.message);
  process.exit();
});

dotenv.config();
const app = require('./app');
const { getLeaderPoints } = require('./controllers/leaderboardController');

const DB = process.env.JAZORO_TEST_DB.replace(
  '<password>',
  process.env.JAZORO_TEST_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to DB successfully...');
  });

mongoose.connection.on('error', (err) => console.log(err.message));
mongoose.connection.on('disconnected', () =>
  console.log('Mongoose connection closed')
);

//   START SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

// Socket IO 
const io = socketIO(server, {
    cors: {
        origin: '*'
    }
})

io.on('connection', socket => {
    socket.on('join', (roomName) => {
        socket.join(roomName)
        socket.emit('welcome', { text: 'Welcome... Please Login to continue -- Just use Postman 😁' })
    })
})

// Set Socket to global variable
global.io = io;

// Event Emitter
const eventEmitter = app.get('eventEmitter')

eventEmitter.on('updatePoints', (data) => {
    io.to('leaderboardRoom').emit('updatePoints', data)
})
eventEmitter.on('newUser', (data) => {
    io.to('leaderboardRoom').emit('newUser', data)
})
eventEmitter.on('login_session', (data) => {
    io.to('leaderboardRoom').emit('login_session', data)
})

// Catching Exceptions

// Application does not necessarily need to be crashed
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit();
  });
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
