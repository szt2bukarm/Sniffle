const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');
// const hpp = require('hpp');

const errorController = require('./controllers/errorController');
const breedRouter = require('./routes/breedRoutes');
const userRouter = require('./routes/userRoutes')
const listingRouter = require('./routes/listingRoutes')
const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
// app.use(helmet());

// Development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true
}))

app.use(cookieParser())

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

// Serving static files
app.use('/public',express.static(`${__dirname}/public`));



// 3) ROUTES
// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);
// app.use('/api/v1/reviews', reviewRouter);
app.use('/api/breed', breedRouter);
app.use('/api/users', userRouter)
app.use('/api/listings', listingRouter)

// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

// app.use(globalErrorHandler);
app.use(errorController)
module.exports = app;
