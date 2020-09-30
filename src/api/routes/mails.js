/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const HttpStatus = require('../../middleware/httpStatus');
const Member = require('../models/member');
const Mail = require('../models/mail');
const logger = require('../../middleware/logger');

const router = express.Router();
const port = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});
const fileFilter = (req, file, cb) => {
  logger.debug(file.mimetype);
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // accept file
    cb(null, true);
  } else {
    // reject a file
    cb(new Error('MIME-Type not accepted'), false);
  }
};
const upload = multer({
  // eslint-disable-next-line object-shorthand
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  // eslint-disable-next-line object-shorthand
  fileFilter: fileFilter,
});

router

  // Get all Mails
  .get('/', (_, res) => {
    Mail.find()
      .select('_id sender reciever content spam sent attachment')
      .populate({ path: 'reciever', select: 'name' })
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
            attachment: mail.attachment,
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
                  body: {
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
        res.status(HttpStatus.OK).json(response);
      })
      .catch((err) => {
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
      });
  })

  // Get Mail by Id
  .get('/:id', async (req, res) => {
    const { id } = req.params;
    Mail.findById(id)
      .select('_id sender reciever content spam sent attachment')
      .populate({ path: 'reciever' })
      .exec()
      .then((mail) => {
        if (mail) {
          res.status(HttpStatus.OK).json({
            mail,
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
          });
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
  .post('/', upload.single('attachment'), (req, res) => {
    const { sender, reciever, content, spam } = req.body;

    Member.findById(reciever).then((member) => {
      if (!member) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Member not found',
        });
      }
      const mail = new Mail({
        _id: new mongoose.Types.ObjectId(),
        sender,
        reciever,
        content,
        spam,
        sent: Date.now(),
        attachment: req.file.path,
      });
      mail
        .save()
        .then((result) => {
          logger.info(result);
          res.status(HttpStatus.CREATED).json({
            message: 'Mail successfully created',
            createdMail: {
              _id: result._id,
              reciever: result.reciever,
              content: result.content,
            },
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
          });
        })
        .catch((err) => {
          logger.info(err);
          res.status(500).json({
            error: err,
          });
        });
    });
  })

  // Update Mail by Id
  .put('/:id', async (req, res) => {
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
  .delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const mail = await Mail.findById(id);
      if (!mail) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Mail not found',
        });
      }

      await Mail.deleteOne({ _id: id });
      res.status(HttpStatus.OK).json({
        message: 'Mail deleted',
      });
    } catch (err) {
      logger.error(err);
      res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
    }
  });

module.exports = router;
