const { static } = require('express');
const express = require('express');
const logger = require('./middleware/logger');
const path = require('path');

const members = require('./Members');

const app = express();

app.use(logger);

// Gets all Members
app.get('/api/members', (req, res) => res.json(members));

// Get Single Member
app.get('api/members/:id', (req, res) => {
    const found = member.some(
        (member) => member.id === parseInt(req.params.id),
    );
    if (found) {
        res.json(
            members.filter((member) => member.id === parseInt(req.params.id)),
        );
    } else {
        res.status(404).json({
            msg: `No member with the id of ${req.params.id}`,
        });
    }
});

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.info(`Server started on port ${PORT}`));
