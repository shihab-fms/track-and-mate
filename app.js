const path = require('path');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// const exp = require('constants');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//usercreated requirement

const userRoute = require('./route/userRoute');
const clientRoute = require('./route/clientRoute');
const viewRoute = require('./route/viewRoute');

const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MiddleWire Function

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Development logging

if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!',
// });
// app.use('/api', limiter);

// Stripe webhook, BEFORE body-parser, because stripe needs the body as stream
// app.post(
//   '/webhook-checkout',
//   bodyParser.raw({ type: 'application/json' }),
//   bookingController.webhookCheckout,
// );

// Body parser and form data parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  }),
);

// test Middleware

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log()
  next();
});

// Route Handler
app.use('/', viewRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/clients', clientRoute);

// Handling error
// app.all('*', (req, _, next)=> {
//   next(new )
// })

module.exports = app;
