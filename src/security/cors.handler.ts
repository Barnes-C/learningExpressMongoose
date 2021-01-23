import cors from 'cors';
import dotenv from 'dotenv';
const result = dotenv.config();
if (result.error !== undefined) {
    throw result.error;
}

const PORT = process.env.PORT || 3000;

export const corsHandler = cors({
    origin: `https://localhost:${PORT}`,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
        'Origin',
        'Content-Type',
        'Accept',
        'Authorization',
        // 'Access-Control-Allow-Origin',
        // 'Access-Control-Allow-Methods',
        // 'Access-Control-Allow-Headers',
        'Allow',
        'Content-Length',
        'Date',
        'Last-Modified',
        'If-Match',
        'If-Not-Match',
        'If-Modified-Since',
    ],
    exposedHeaders: ['Location', 'ETag'],
    maxAge: 86400,
});
