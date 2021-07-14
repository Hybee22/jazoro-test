const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Emitter = require('events')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const key = require('./utils/libs/gen-key');

const AppError = require('./utils/libs/appError');
const globalErrorHandler = require('./controllers/errorController');

dotenv.config();
process.env.JAZORO_TEST_ACCESS_TOKEN_SECRET = key(64);
process.env.JAZORO_TEST_COOKIE_SECRET = key(64);

const app = express();

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

app.use(express.static(__dirname + '/public'))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Events Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

// Cookie Parser
app.use(cookieParser());

const userRouter = require('./routes/userRoutes');
const pointRouter = require('./routes/pointRoutes');

// Routes Middleware
app.use('/api/v1/users', userRouter)
app.use('/api/v1/points', pointRouter)

// Unhandles Routes
app.all('*', (req, res, next) => {
  next(
    new AppError(`Can't find resource ${req.originalUrl} on this server`, 404)
  );
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
