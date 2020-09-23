const express = require('express');
const { hashSync } = require('bcrypt');
const mongoose = require('mongoose');
const HttpStatus = require('../../middleware/httpStatus');
const Member = require('../../member/entity/member.model');
const members = require('../../middleware/config/db/Members');
const logger = require('../../middleware/logger');

const router = express.Router();

const SALT_ROUNDS = 10;

router
  // Get all Members
  .get('/', (_, res) => res.json(members))
  // Get all Members by Id
  .get('/:id', (req, res) => {
    // const { id } = req.params;
    // Member.find();
  })
  // Create Member
  .post('/', (req, res) => {
    const { firstName, lastName, password } = req.body;

    if (!firstName || !password || !lastName) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('<p>Please include a name, last name and password</p>');
    }

    // Encrypting Password via bcrypt: $2b$[cost]$[22 character salt][31 character hash]
    const pwd = hashSync(password, SALT_ROUNDS);

    const member = new Member({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      password: pwd,
      subscribed: true,
      age: null,
      created: Date.now(),
    });
    member
      .save()
      .then((result) => {
        res.redirect('/');
        logger.info(result);
      })
      .catch((err) => {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(`unable to save to database, ${err}`)
          .redirect('/');
        logger.error(err);
      });

    members.push(member);
  })
  // Update Member by Id
  .put('/:id', (req, res) => {
    const { id, name, password } = req.body;
    // eslint-disable-next-line no-underscore-dangle
    const found = members.some((member) => member._id === id);
    if (found) {
      members.forEach((member) => {
        // eslint-disable-next-line no-underscore-dangle
        if (member._id === id) {
          member.name = name || member.name; // eslint-disable-line no-param-reassign
          member.password = password || member.password; // eslint-disable-line no-param-reassign
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
    // eslint-disable-next-line no-underscore-dangle
    const found = members.some((member) => member._id === id);
    if (found) {
      res.json({
        msg: 'Member deleted',
        // eslint-disable-next-line no-underscore-dangle
        members: members.filter((member) => member._id !== id),
      });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        msg: `No member with the id of ${id}`,
      });
    }
  });

module.exports = router;
