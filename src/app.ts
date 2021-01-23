import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import favicon from 'serve-favicon';
import { HttpStatus } from './shared/httpStatus';
import { dbConfig } from './shared/config/db/db';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// Set public/static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set Favicon
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));

// API Routes
const UserRoutes = require('./api/routes/users');

app.use('/users', UserRoutes);

// Catch 404 and forward to Error-Handler
app.use((req: Request, _: Response, next) => {
    const error = new Error(`${req.url} not found`);
    error.status = HttpStatus.NOT_FOUND;
    next(error);
});

// Error-Handler
app.use((error: Error, res: Response) => {
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

export = app;
