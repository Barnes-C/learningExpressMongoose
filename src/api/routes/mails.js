/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const HttpStatus = require('../../middleware/httpStatus');
const Member = require('../models/member');
const Mail = require('../models/mail');
const logger = require('../../middleware/logger');

const router = express.Router();

const port = process.env.PORT || 5000;

router

  // Get all Mails
  .get('/', (_, res) => {
    Mail.find()
      .select('_id sender reciever content spam sent')
      .exec()
      .then((mails) => {
        const response = {
          count: mails.length,
          mails: mails.map((mail) => ({
            _id: mail._id,
            sender: mail.sender,
            reciever: mail.reciever,
            content: mail.content,
            spam: mail.spam,
            sent: mail.sent,
            request: {
              type: 'GET POST DELETE PUT',
              _links: {
                self: {
                  href: `http://127.0.0.1:${port}/mail/${mail._id}`,
                },
                list: {
                  href: `http://127.0.0.1:${port}/mail`,
                },
                post: {
                  href: `http://127.0.0.1:${port}/mail`,
                  data: {
                    reciever: 'ObjectID',
                    content: 'String',
                  },
                },
                delete: {
                  href: `http://127.0.0.1:${port}/mail/${mail._id}`,
                },
              },
            },
          })),
        };

        logger.info(response);
        res.status(HttpStatus.OK).json(response);
      })
      .catch((err) => {
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
      });
  })

  // Get Mail by Id
  .get('/:id', (req, res) => {
    const { id } = req.params;
    Mail.findById(id)
      .select('_id sender reciever content spam sent')
      .exec()
      .then((mail) => {
        if (mail) {
          const response = {
            _id: mail._id,
            sender: mail.sender,
            reciever: mail.reciever,
            content: mail.content,
            spam: mail.spam,
            sent: mail.sent,
            request: {
              type: 'GET POST DELETE PUT',
              _links: {
                self: {
                  href: `http://127.0.0.1:${port}/mail/${mail._id}`,
                },
                list: {
                  href: `http://127.0.0.1:${port}/mail`,
                },
                delete: {
                  href: `http://127.0.0.1:${port}/mail/${mail._id}`,
                },
              },
            },
          };
          res.status(HttpStatus.OK).json(response);
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

    Member.findById(reciever)
      .then((result) => {
        if (!result) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: 'Product not found',
          });
        }
        const mail = new Mail({
          _id: new mongoose.Types.ObjectId(),
          sender,
          reciever,
          content,
          spam,
          sent: Date.now(),
        });
        return mail.save();
      })

      .then((result) => {
        res.status(HttpStatus.CREATED).json({
          message: 'Created mail successfully',
          createdMail: {
            _id: result._id,
            sender: result.sender,
            reciever: result.reciever,
            content: result.content,
            spam: result.spam,
            sent: result.sent,
            request: {
              type: 'GET POST DELETE PUT',
              _links: {
                self: {
                  href: `http://127.0.0.1:${port}/mail/${result._id}`,
                },
                list: {
                  href: `http://127.0.0.1:${port}/mail`,
                },
                delete: {
                  href: `http://127.0.0.1:${port}/mail/${result._id}`,
                },
              },
            },
          },
        });
        logger.info(result);
      })
      .catch((err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          error: err,
        });
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
        res.status(HttpStatus.OK).json({
          message: 'Mail updated',
          request: {
            type: 'GET PUT DELETE',
            _links: {
              self: {
                href: `http://127.0.0.1:${port}/mail/${result._id}`,
              },
              put: {
                href: `http://127.0.0.1:${port}/mail/${result._id}`,
              },
              delete: {
                href: `http://127.0.0.1:${port}/mail/${result._id}`,
              },
            },
          },
        });
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
      .then(() => {
        res.status(HttpStatus.OK).json({
          message: 'Mail deleted',
          request: {
            type: 'POST',
            _links: {
              post: {
                href: `http://127.0.0.1:${port}/mail`,
                data: {
                  reciever: 'ObjectID',
                  content: 'String',
                },
              },
            },
          },
        });
      })
      .catch((err) => {
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
      });
  });

module.exports = router;
