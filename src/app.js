const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');
const HttpStatus = require('./middleware/httpStatus');
const { dbConfig } = require('./middleware/config/db/db');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));

// Homepage
app.get('/', async (_, res) => res.render('index', { title: 'Member App' }));

// Set public/static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set Favicon
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));

// API Routes
const UserRoutes = require('./api/routes/users');

app.use('/user', UserRoutes);

// CORS Handler
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'localhost barnes.biz 127.0.0.1');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(HttpStatus.OK).json({});
  }
  next();
});

// Catch 404 and forward to Error-Handler
app.use((req, _, next) => {
  const error = new Error(`${req.url} not found`);
  error.status = HttpStatus.NOT_FOUND;
  next(error);
});

// Error-Handler
app.use((error, res) => {
  res.status(error.status || HttpStatus.INTERNAL_ERROR);
  if (process.env.NODE_ENV === 'development') {
    res.json({
      error: {
        message: error.message,
      },
    });
  }
});

// MongoDB Connection
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

module.exports = app;
