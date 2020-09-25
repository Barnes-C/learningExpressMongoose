const express = require('express');
const mongoose = require('mongoose');
const HttpStatus = require('../../middleware/httpStatus');
const Mail = require('../models/member');
const logger = require('../../middleware/logger');

const router = express.Router();

router

  // Get all Mails
  .get('/', (req, res) => {
    Mail.find()
      .exec()
      .then((docs) => {
        logger.info(docs);
        res.status(HttpStatus.OK).json(docs);
      })
      .catch((err) => {
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
      });
  })

  // Get Mail by Id
  .get('/:id', (req, res) => {
    const { id } = req.params;
    Mail.findById(id)
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

  // Create Mail
  .post('/', (req, res) => {
    const { sender, reciever, content, spam } = req.body;

    const mail = new Mail({
      _id: new mongoose.Types.ObjectId(),
      sender,
      reciever,
      content,
      spam,
      send: Date.now(),
    });

    mail
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

  // Update Mail by Id
  .put('/:id', (req, res) => {
    const { id } = req.params;
    const target = mongoose.Types.ObjectId(id);

    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    Mail.updateOne({ _id: target }, { $set: updateOps })
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

  // Delete Mail by Id
  .delete('/:id', (req, res) => {
    const { id } = req.params;
    const target = mongoose.Types.ObjectId(id);
    Mail.deleteOne({ _id: target })
      .exec()
      .then((result) => {
        res.status(HttpStatus.OK).json(result);
      })
      .catch((err) => {
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
      });
  });

module.exports = router;
