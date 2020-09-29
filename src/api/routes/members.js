/* eslint-disable no-underscore-dangle */
const express = require('express');
const { hashSync } = require('bcrypt');
const mongoose = require('mongoose');
const HttpStatus = require('../../middleware/httpStatus');
const Member = require('../models/member');
const logger = require('../../middleware/logger');

const router = express.Router();

const port = process.env.PORT || 5000;
const SALT_ROUNDS = 10;

router

  // Get all Members
  .get('/', (_, res) => {
    Member.find()
      .select('_id firstName lastName password age subscribed created')
      .exec()
      .then((members) => {
        const response = {
          count: members.length,
          members: members.map((member) => ({
            _id: member._id,
            firstName: member.firstName,
            lastName: member.lastName,
            password: member.password,
            age: member.age,
            subscribed: member.subscribed,
            created: member.created,
            request: {
              type: 'GET POST DELETE PUT',
              _links: {
                self: {
                  href: `http://127.0.0.1:${port}/member/${member._id}`,
                },
                list: {
                  href: `http://127.0.0.1:${port}/member`,
                },
                post: {
                  href: `http://127.0.0.1:${port}/member`,
                  data: {
                    firstName: 'String',
                    lastName: 'String',
                    password: 'String',
                  },
                },
                delete: {
                  href: `http://127.0.0.1:${port}/member/${member._id}`,
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

  // Get Member by Id
  .get('/:id', (req, res) => {
    const { id } = req.params;
    Member.findById(id)
      .select('_id firstName lastName password age subscribed created')
      .exec()
      .then((member) => {
        if (member) {
          const response = {
            _id: member._id,
            firstName: member.firstName,
            lastName: member.lastName,
            password: member.password,
            age: member.age,
            subscribed: member.subscribed,
            created: member.created,
            request: {
              type: 'GET PUT DELETE',
              _links: {
                self: {
                  href: `http://127.0.0.1:${port}/member/${member._id}`,
                },
                put: {
                  href: `http://127.0.0.1:${port}/member/${member._id}`,
                },
                delete: {
                  href: `http://127.0.0.1:${port}/member/${member._id}`,
                },
              },
            },
          };
          logger.info(response);
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
        res.status(HttpStatus.CREATED).json({
          message: 'Created member successfully',
          createdMember: {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            password: result.password,
            age: result.age,
            subscribed: result.subscribed,
            created: result.created,
            request: {
              type: 'GET PUT DELETE',
              _links: {
                self: {
                  href: `http://127.0.0.1:${port}/member/${result._id}`,
                },
                put: {
                  href: `http://127.0.0.1:${port}/member/${result._id}`,
                },
                delete: {
                  href: `http://127.0.0.1:${port}/member/${result._id}`,
                },
              },
            },
          },
        });
        logger.info(member);
      })
      .catch((err) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          error: err,
        });
        logger.error(err);
      });
  })

  // Update Member by Id
  .put('/:id', (req, res) => {
    const { id } = req.params;
    const target = mongoose.Types.ObjectId(id);

    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    Member.updateOne({ _id: target }, { $set: updateOps })
      .exec()
      .then((result) => {
        logger.info(result);
        res.status(HttpStatus.OK).json({
          message: 'Member updated',
          request: {
            type: 'GET PUT DELETE',
            _links: {
              self: {
                href: `http://127.0.0.1:${port}/member/${result._id}`,
              },
              put: {
                href: `http://127.0.0.1:${port}/member/${result._id}`,
              },
              delete: {
                href: `http://127.0.0.1:${port}/member/${result._id}`,
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

  // Delete Member by Id
  .delete('/:id', (req, res) => {
    const { id } = req.params;
    const target = mongoose.Types.ObjectId(id);
    Member.deleteOne({ _id: target })
      .exec()
      .then(() => {
        res.status(HttpStatus.OK).json({
          message: 'Member deleted',
          request: {
            type: 'POST',
            _links: {
              post: {
                href: `http://127.0.0.1:${port}/member/`,
                data: {
                  firstName: 'String',
                  lastName: 'String',
                  password: 'String',
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
