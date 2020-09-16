const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const members = require('../../Members');
const HttpStatus = require('../../middleware/HttpStatus');
const { hash } = require('bcrypt');
const SALT_ROUNDS = 10;

router
    // Get all Members
    .get('/', (_, res) => res.json(members))
    // Get all Members by Id
    .get('/:id', (req, res) => {
        const { id } = req.body;
        const found = members.some((member) => member.id === parseInt(id));
        if (found) {
            res.json(members.filter((member) => member.id === parseInt(id)));
        } else {
            res.status(HttpStatus.NOT_FOUND).json({
                msg: `No member with the id of ${id}`,
            });
        }
    })
    // Create Member
    .post('/', (req, res) => {
        let { name, password } = req.body;
        let newMember = {
            id: uuid.v4(), // not needed when using mongoDB
            name: name,
            password: password,
            active: true,
        };
        if (!name || !password) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                msg: 'Please include a name and password',
            });
        }
        // Encrypting Password via bcrypt
        hash(password, SALT_ROUNDS, function (err, hash) {
            if (err) {
                return err;
            } else {
                console.log(hash);

                newMember.password = hash;
            }
        });
        console.log(password);
        // members.save(newMember) <-- mongoose
        members.push(newMember);
        res.redirect(HttpStatus.FOUND, '/');
    })
    // Update Member by Id
    .put('/:id', (req, res) => {
        const { id, name, password } = req.body;
        const found = members.some((member) => member.id === parseInt(id));
        if (found) {
            members.forEach((member) => {
                if (member.id === parseInt(id)) {
                    member.name = name ? name : member.name;
                    member.password = password ? password : member.password;
                    res.json({ msg: 'Member updated', member });
                }
            });
        } else {
            res.status(HttpStatus.NOT_FOUND).json({
                msg: `No member with the id of ${id}`,
            });
        }
    })
    // Delete Member by Id
    .delete('/:id', (req, res) => {
        const { id } = req.body;
        const found = members.some((member) => member.id === parseInt(id));
        if (found) {
            res.json({
                msg: 'Member deleted',
                members: members.filter((member) => member.id !== parseInt(id)),
            });
        } else {
            res.status(HttpStatus.NOT_FOUND).json({
                msg: `No member with the id of ${id}`,
            });
        }
    });

module.exports = router;
