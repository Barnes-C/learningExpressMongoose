const express = require('express');
const { hashSync } = require('bcrypt');
const mongoose = require('mongoose');
const MemberModel = require('../../member/entity/member.model');
const members = require('../../middleware/config/db/Members');
const HttpStatus = require('../../middleware/httpStatus');
const logger = require('../../middleware/logger');

const router = express.Router();

const SALT_ROUNDS = 10;

router
  // Get all Members
  .get('/', (_, res) => res.json(members))
  // Get all Members by Id
  .get('/:id', (req, res) => {
    const { id } = req.params;
    const found = members.some((member) => member.id === parseInt(id, 10));
    if (found) {
      res.json(members.filter((member) => member.id === parseInt(id, 10)));
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .send(`<p>No member with the id of ${id}</p>`);
      logger.info(`No member found with the id of ${id}`);
    }
  })
  // Create Member
  .post('/', (req, res) => {
    const { name, password, lastName } = req.body;
    const newMember = {
      _id: null,
      name,
      lastName,
      password,
      active: true,
      age: null,
      created: Date.now(),
    };

    if (!name || !password || !lastName) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('<p>Please include a name and password</p>');
    }
    // Encrypting Password via bcrypt: $2b$[cost]$[22 character salt][31 character hash]
    newMember.password = hashSync(password, SALT_ROUNDS);

    mongoose.Promise = global.Promise;
    mongoose.connect(
      'mongodb+srv://BarnesC:p@barnescluster0.wmnj6.mongodb.net/members?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true }
    );

    MemberModel.create(newMember, (err) => {
      if (err) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(`unable to save to database, ${err}`)
          .redirect('/');
      } else {
        res.status(HttpStatus.OK).redirect('/');
      }
    });

    members.push(newMember);
  })
  // Update Member by Id
  .put('/:id', (req, res) => {
    const { id, name, password } = req.body;
    const found = members.some((member) => member.id === parseInt(id, 10));
    if (found) {
      members.forEach((member) => {
        if (member.id === parseInt(id, 10)) {
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
    const found = members.some((member) => member.id === parseInt(id, 10));
    if (found) {
      res.json({
        msg: 'Member deleted',
        members: members.filter((member) => member.id !== parseInt(id, 10)),
      });
    } else {
      res.status(HttpStatus.NOT_FOUND).json({
        msg: `No member with the id of ${id}`,
      });
    }
  });

module.exports = router;
