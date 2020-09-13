const express = require('express');
let router = express.Router();

// Bei middleware-functions muss immer next aufgerufen werden wenn der request-response cycle nicht beendet wird. This code is executed for every request to the router
router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});

// a middleware sub-stack shows request info for any type of HTTP request to the /mail/:id path
router.use(
    '/mail/:id',
    function (req, res, next) {
        console.log('Request URL:', req.originalUrl);
        next();
    },
    function (req, res, next) {
        console.log('Request Type:', req.method);
        next();
    },
);

router
    .route('/mail')
    .get(function (req, res) {
        res.send('mail GET');
    })
    .post((req, res) => {
        res.send('mail POST');
    });
