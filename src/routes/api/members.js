const express = require('express');
const { hashSync } = require('bcrypt');
const mongoose = require('mongoose');
const HttpStatus = require('../../middleware/httpStatus');
const { dbConfig } = require('../../middleware/config/db/db');
const MemberModel = require('../../member/entity/member.model');
const members = require('../../middleware/config/db/Members');
const logger = require('../../middleware/logger');

const router = express.Router();

const SALT_ROUNDS = 10;

router
  // Get all Members
  .get('/', (_, res) => res.json(members))
  // Get all Members by Id
  .get('/:id', (req, res) => {
    const { id } = req.params;
    // eslint-disable-next-line no-underscore-dangle
    const found = members.some((member) => member._id === id);
    if (found) {
      res
        // eslint-disable-next-line no-underscore-dangle
        .json(members.filter((member) => member._id === id))
        .status(HttpStatus.OK);
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
    const member = {
      _id: new mongoose.Types.ObjectId().toHexString().toString(),
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
        .send('<p>Please include a name, last name and password</p>');
    }
    // Encrypting Password via bcrypt: $2b$[cost]$[22 character salt][31 character hash]
    member.password = hashSync(password, SALT_ROUNDS);

    mongoose.Promise = global.Promise;
    mongoose.connect(dbConfig.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    MemberModel.create(member, (err) => {
      if (err) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .send(`unable to save to database, ${err}`)
          .redirect('/');
      } else {
        res
          .status(HttpStatus.CREATED)

          .redirect(201, '../');
      }
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
