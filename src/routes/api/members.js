const express = require('express');
const { hashSync } = require('bcrypt');
const mongoose = require('mongoose');
const HttpStatus = require('../../middleware/httpStatus');
const Member = require('../../member/entity/member.model');
const logger = require('../../middleware/logger');
const { update } = require('../../member/entity/member.model');

const router = express.Router();

const SALT_ROUNDS = 10;

router

  // Get all Members
  .get('/', (req, res) => {
    Member.find()
      .exec()
      .then((docs) => {
        logger.info(docs);
        res.status(HttpStatus.OK).json(docs);
      })
      .catch((err) => {
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
      });
  })

  // Get Member by Id
  .get('/:id', (req, res) => {
    const { id } = req.params;
    Member.findById(id)
      .exec()
      .then((doc) => {
        if (doc) {
          res.status(HttpStatus.OK).json(doc);
        } else {
          res
            .status(HttpStatus.NOT_FOUND)
            .json({ msg: 'No valid entry found for provided ID' });
        }
      })
      .catch((err) => {
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
        logger.error(err);
      });
  })

  // Create Member
  .post('/', (req, res) => {
    const { firstName, lastName, password } = req.body;

    if (!firstName || !password || !lastName) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .send('<p>Please include a name, last name and password</p>');
    }

    const member = new Member({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      password: hashSync(password, SALT_ROUNDS),
      subscribed: true,
      age: null,
      created: Date.now(),
    });

    member
      .save()
      .then((result) => {
        res.status(HttpStatus.CREATED).json(result);
        logger.info(result);
      })
      .catch((err) => {
        res.status(HttpStatus.BAD_REQUEST).json({ error: err });
        logger.error(err);
      });
  })

  // Update Member by Id
  .put('/:id', (req, res) => {
    const { id, newFirstName, newLastName, newPassword } = req.body;
    const target = mongoose.Types.ObjectId(id);

    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Member.updateOne({ _id: target }, { $set: updateOps })
      .exec()
      .then((result) => {
        logger.info(result);
        res.status(HttpStatus.OK).json(result);
      })
      .catch((err) => {
        logger.error(err);
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
      });
  })

  // Delete Member by Id
  .delete('/:id', (req, res) => {
    const { id } = req.params;
    const target = mongoose.Types.ObjectId(id);
    Member.deleteOne({ _id: target })
      .exec()
      .then((result) => {
        res.status(HttpStatus.OK).json(result);
      })
      .catch((err) => {
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
      });
  });

module.exports = router;
