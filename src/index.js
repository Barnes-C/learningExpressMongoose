const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const logger = require('./middleware/logger');
const members = require('./Members');
const app = express();

const mongoose = require('mongoose');

// Handlebars Middleware
app.set('views', path.join(__dirname, '/views'));
app.set('partials', path.join(__dirname, '/views/layouts'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Homepage route mit object passing
app.get('/', async (_, res) =>
    res.render('index', {
        title: 'Member App',
        members,
    }),
);

// Logger Middleware
app.use(logger);

// Set public/static folder (muss unter der route mit der homepage sein)
app.use(express.static(path.join(__dirname, 'public')));

// Members API Routes
app.use('/api/members', require('./routes/api/members'));

// MongoDB connection
mongoose.connect(
    'mongodb+srv://BarnesC:p@barnescluster0.wmnj6.mongodb.net/members?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    () => console.info('Connected to Atlas...'),
);

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.info(`Server started on port ${PORT}`));
