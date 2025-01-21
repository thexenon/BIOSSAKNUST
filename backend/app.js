const express = require('express');
const morgan = require('morgan');
const path = require('path');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoutes');
const updateRouter = require('./routes/updateRoutes');
const mainAnonRouter = require('./routes/mainAnonRoutes');
const mainCommentRouter = require('./routes/mainCommentRoutes');
const yearAnonRouter = require('./routes/yearAnonRoutes');
const yearCommentRouter = require('./routes/yearCommentRoutes');
const AppError = require('./utils/appError');
const myErrorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
// 1) GLOBAL MIDDLEWARES
// Allow Access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

// View engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['duration'],
  }),
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(compression());
// 3) Routes
app.use('/', viewRouter);
app.use('/api/v1/maincomments', mainCommentRouter);
app.use('/api/v1/mainanons', mainAnonRouter);
app.use('/api/v1/yearcomments', yearCommentRouter);
app.use('/api/v1/yearanons', yearAnonRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/updates', updateRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Error: ${req.originalUrl} is not on this server`, 404));
});

app.use(myErrorHandler);

module.exports = app;
