const express = require('express');
const uuid = require('uuid');
const router = express.Router();
const members = require('../../Members');
const httpStatus = require('../../middleware/HttpStatus');
const memberModel = require('../../member/entity/member.model');
const bcrypt = require('bcrypt');

router.get('/', (_, res) => res.json(members));

router
    .get('/:id', async (req, res) => {
        const found = members.some(
            (member) => member.id === parseInt(req.params.id),
        );
        if (found) {
            res.json(
                members.filter(
                    (member) => member.id === parseInt(req.params.id),
                ),
            );
        } else {
            res.status(httpStatus.NOT_FOUND).json({
                msg: `No member with the id of ${req.params.id}`,
            });
        }
    })
    .post('/', async (req, res) => {
        const newMember = new memberModel(req.body);

        try {
            await newMember.save();
            res.send(newMember);
        } catch (err) {
            res.status(httpStatus.INTERNAL_ERROR).send(err);
        }
    })
    // .post('/', async (req, res) => {
    //     const newMember = {
    //         id: uuid.v4(),
    //         name: req.body.name,
    //         password: req.body.password,
    //         active: true,
    //     };
    //     if (!newMember.name || !newMember.password) {
    //         return res.status(httpStatus.BAD_REQUEST).json({
    //             msg: 'Please include a name and password',
    //         });
    //     }
    //     bcrypt.hash(newMember.password, 10, function (err, hash) {
    //         if (err) {
    //             return err;
    //         } else {
    //             newMember.password = hash;
    //         }
    //     });
    //     // members.save(newMember) <-- mongoose
    //     members.push(newMember);
    //     //res.json(members);
    //     res.redirect('/');
    // })
    .put('/:id', async (req, res) => {
        const found = members.some(
            (member) => member.id === parseInt(req.params.id),
        );
        if (found) {
            const updMember = req.body;
            members.forEach((member) => {
                if (member.id === parseInt(req.params.id)) {
                    member.name = updMember.name ? updMember.name : member.name;
                    member.password = updMember.password
                        ? updMember.password
                        : member.password;
                    res.json({ msg: 'Member updated', member });
                }
            });
        } else {
            res.status(httpStatus.NOT_FOUND).json({
                msg: `No member with the id of ${req.params.id}`,
            });
        }
    })
    .delete('/:id', async (req, res) => {
        const found = members.some(
            (member) => member.id === parseInt(req.params.id),
        );
        if (found) {
            res.json({
                msg: 'Member deleted',
                members: members.filter(
                    (member) => member.id !== parseInt(req.params.id),
                ),
            });
        } else {
            res.status(httpStatus.NOT_FOUND).json({
                msg: `No member with the id of ${req.params.id}`,
            });
        }
    });

module.exports = router;
