const express = require('express');
const router = express.Router();
const members = require('../../Members');
const uuid = require('uuid');
const HttpStatus = require('../../middleware/HttpStatus');
const memberModel = require('../../member/entity/member.model');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

router.get('/', (_, res) => res.json(members));
router
    // Get Member by ID
    // .get('/:id', async (req, res) => {
    //     const { id } = req.params;
    //     try {
    //         const member = await memberModel.findById(id);
    //         if (!member)
    //             res.status(NOT_FOUND).send(`No Member found with the id ${id}`);
    //         res.status(OK).send();
    //         res.send(member);
    //     } catch (err) {
    //         res.status(HttpStatus.INTERNAL_ERROR).send(err);
    //     }
    // })

    .get('/:id', async (req, res) => {
        const { id } = req.params;
        const found = members.some((member) => member.id === parseInt(id));
        if (found) {
            res.json(members.filter((member) => member.id === parseInt(id)));
        } else {
            res.status(HttpStatus.NOT_FOUND).json({
                msg: `No member with the id of ${id}`,
            });
        }
    })
    // .post('/', async (req, res) => {
    //     const newMember = new memberModel(req.body);
    //     console.log(newMember);

    //     try {
    //         await newMember.save();
    //         res.send(newMember);
    //     } catch (err) {
    //         res.status(HttpStatus.INTERNAL_ERROR).send(err);
    //     }
    // })
    .post('/', (req, res) => {
        const { name, password } = req.params;
        const newMember = {
            id: uuid.v4(),
            name: name,
            password: password,
            created: Date.now(),
            active: true,
        };
        console.log(newMember);
        console.log(newMember.name);
        console.log(newMember.password);
        if (!newMember.name || !newMember.password) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                msg: 'Please include a name and password',
            });
        }
        // bcrypt.hash(newMember.password, 10, function (err, hash) {
        //     if (err) {
        //         return err;
        //     } else {
        //         newMember.password = hash;
        //     }
        // });
        // members.save(newMember) <-- mongoose
        members.push(newMember);
        res.json(members);
        res.redirect('/');
    })
    .put('/:id', async (req, res) => {
        const { id } = req.params;
        const found = members.some((member) => member.id === parseInt(id));
        if (found) {
            const updMember = req.body;
            members.forEach((member) => {
                if (member.id === parseInt(id)) {
                    member.name = updMember.name ? updMember.name : member.name;
                    member.password = updMember.password
                        ? updMember.password
                        : member.password;
                    res.json({ msg: 'Member updated', member });
                }
            });
        } else {
            res.status(HttpStatus.NOT_FOUND).json({
                msg: `No member with the id of ${id}`,
            });
        }
    })
    .delete('/:id', async (req, res) => {
        const { id } = req.params;
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
