const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const path = require('path');
const HttpStatus = require('./middleware/httpStatus');
const logger = require('./middleware/logger');
const members = require('./middleware/config/db/Members');
const { addColors } = require('winston/lib/winston/config');

// Middleware
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(HttpStatus.OK).json({});
  }
  next();
});

// Handlebars Settings
app.set('views', path.join(__dirname, '/views'));
app.set('partials', path.join(__dirname, '/views/layouts'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Homepage route mit object passing
app.get('/', async (_, res) =>
  res.render('index', { title: 'Member App', members })
);

// Set public/static folder (muss unter der route mit der homepage sein)
app.use(express.static(path.join(__dirname, 'public')));

// Members API Routes
app.use('/api/members', require('./routes/api/members'));

app.use((res, req, next) => {
  const error = new Error('Not found');
  error.status = HttpStatus.NOT_FOUND;
  next(error);
});

app.use((error, res) => {
  res.status(error.status || HttpStatus.INTERNAL_ERROR);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server started on port ${PORT}`));
