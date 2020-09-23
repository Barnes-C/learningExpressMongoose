const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');
const HttpStatus = require('./middleware/httpStatus');
const members = require('./middleware/config/db/Members');
const { dbConfig } = require('./middleware/config/db/db');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));

// Handlebars Settings for View-Engine
app.set('views', path.join(__dirname, '/views'));
app.set('partials', path.join(__dirname, '/views/layouts'));
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set('view engine', 'handlebars');

// Homepage
app.get('/', async (_, res) =>
  res.render('index', { title: 'Member App', members })
);

// Set public/static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set Favicon
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));

// API Routes
const MemberRoutes = require('./routes/api/members');
// const MailRoutes = require('./routes/api/mail');

app.use('/api/members', MemberRoutes);
// app.use('/api/mail', MailRoutes);

// CORS Handler
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(HttpStatus.OK).json({});
  }
  next();
});

// Catch 404 and forward to Error-Handler
app.use((res, req, next) => {
  const error = new Error('Not found');
  error.status = HttpStatus.NOT_FOUND;
  next(error);
});

// Error-Handler
app.use((error, res) => {
  res.status(error.status || HttpStatus.INTERNAL_ERROR);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// MongoDB Connection
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = app;
