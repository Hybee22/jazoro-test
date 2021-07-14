const User = require('../models/userModel');
const Point = require('../models/pointModel')
const LeaderBoard = require('../models/leaderboardModel')
const catchAsync = require('../utils/libs/catchAsync');
const AppError = require('../utils/libs/appError');

const {
  signAccessToken,
  verifyAccessToken,
} = require('../utils/libs/jwt-helper');
const { getLeaderPoints } = require('./leaderboardController');

const createSendToken = (user, statusCode, res) => {
  const token = signAccessToken({ id: user._id });

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JAZORO_TEST_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    return next(new AppError('Email already taken', 400));
  }

  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const point = await Point.create({
      userId: newUser._id,
      points: 0
  })

  await LeaderBoard.create({
      user: newUser._id,
      points: point._id,
  })

  createSendToken(newUser, 201, res);

    // Emit Event
    const eventEmitter = req.app.get('eventEmitter')
    eventEmitter.emit('newUser', { data: { id: newUser._id, user: newUser.username, point: 0 } })
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // Check if the user exists and password correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  // If all true, send token to user
  createSendToken(user, 200, res);
    // Emit Event
    const eventEmitter = req.app.get('eventEmitter')
    const points = await getLeaderPoints()

    eventEmitter.emit('login_session', { data: points })
});

// Logout User
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

// Protects Routes
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Get token and check if it exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1].toString();
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!. Please login to gain access', 401)
    ); // 401 - Unauthorised
  }
  // Token verification
  const decoded = verifyAccessToken(token.toString());

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('This user no longer exist', 401));
  }

  // Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again.', 401)
    );
  }

  // Grant user access to route
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

