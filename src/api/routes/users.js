/* eslint-disable no-underscore-dangle */
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const HttpStatus = require('../../middleware/httpStatus');
const User = require('../models/user');
const logger = require('../../middleware/logger');

const router = express.Router();

const port = process.env.PORT || 5000;
const SALT_ROUNDS = 10;

router

  // Get all Users
  .get('/', (_, res) => {
    User.find()
      .select('_id name email password age subscribed created')
      .exec()
      .then((users) => {
        const response = {
          count: users.length,
          users: users.map((user) => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            age: user.age,
            subscribed: user.subscribed,
            created: user.created,
            request: {
              type: 'GET POST DELETE PUT',
              _links: {
                self: {
                  href: `http://127.0.0.1:${port}/user/${user._id}`,
                },
                list: {
                  href: `http://127.0.0.1:${port}/user`,
                },
                post: {
                  href: `http://127.0.0.1:${port}/user`,
                  data: {
                    name: 'String',
                    email: 'String',
                    password: 'String',
                  },
                },
                delete: {
                  href: `http://127.0.0.1:${port}/user/${user._id}`,
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

  // Get User by Id
  .get('/:id', (req, res) => {
    const { id } = req.params;
    User.findById(id)
      .select('_id name email password age subscribed created')
      .exec()
      .then((user) => {
        if (user) {
          res.status(HttpStatus.OK).json({
            user,
            request: {
              type: 'GET PUT DELETE',
              _links: {
                self: {
                  href: `http://127.0.0.1:${port}/user/${user._id}`,
                },
                put: {
                  href: `http://127.0.0.1:${port}/user/${user._id}`,
                },
                delete: {
                  href: `http://127.0.0.1:${port}/user/${user._id}`,
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

  // Create User
  .post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    User.find({ email: email })
      .exec()
      .then((doc) => {
        if (doc.length >= 1) {
          return res
            .status(HttpStatus.CONFLICT)
            .json({ message: 'Mail already exists' });
        }
        bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
          if (err) {
            return res.status(HttpStatus.INTERNAL_ERROR).json({
              error: err,
            });
          }
          const user = new User({
            name,
            email,
            password: hash,
            age: null,
          });
          user
            .save()
            .then((result) => {
              res.status(HttpStatus.CREATED).json({
                message: 'Created user successfully',
                createdUser: {
                  _id: result._id,
                  name: result.name,
                  email: result.email,
                  password: result.password,
                  age: result.age,
                  subscribed: result.subscribed,
                  created: result.created,
                  request: {
                    type: 'GET PUT DELETE',
                    _links: {
                      self: {
                        href: `http://127.0.0.1:${port}/user/${result._id}`,
                      },
                      put: {
                        href: `http://127.0.0.1:${port}/user/${result._id}`,
                      },
                      delete: {
                        href: `http://127.0.0.1:${port}/user/${result._id}`,
                      },
                    },
                  },
                },
              });
              logger.info(user);
            })
            .catch((error) => {
              res.status(HttpStatus.BAD_REQUEST).json({
                error,
              });
              logger.error(error);
            });
        });
      })
      .catch((error) => {
        res.status(HttpStatus.BAD_REQUEST).json({
          error,
        });
        logger.error(error);
      });
  })

  // Update User by Id
  .put('/:id', (req, res) => {
    const { id } = req.params;
    const target = mongoose.Types.ObjectId(id);

    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }

    User.updateOne({ _id: target }, { $set: updateOps })
      .exec()
      .then((result) => {
        logger.info(result);
        res.status(HttpStatus.OK).json({
          message: 'User updated',
          request: {
            type: 'GET PUT DELETE',
            _links: {
              self: {
                href: `http://127.0.0.1:${port}/user/${result._id}`,
              },
              put: {
                href: `http://127.0.0.1:${port}/user/${result._id}`,
              },
              delete: {
                href: `http://127.0.0.1:${port}/user/${result._id}`,
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

  // Delete User by Id
  .delete('/:id', (req, res) => {
    const { id } = req.params;
    User.findById(id)
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: `User not found for id: ${id}` });
        }
        User.deleteOne({ _id: id })
          .exec()
          .then(() => {
            res.status(HttpStatus.OK).json({
              message: 'User deleted',
              request: {
                type: 'POST',
                _links: {
                  post: {
                    href: `http://127.0.0.1:${port}/user/`,
                    body: {
                      name: 'String',
                      email: 'String',
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
      })
      .catch((err) => {
        res.status(HttpStatus.INTERNAL_ERROR).json({ error: err });
      });
  });

module.exports = router;
