/* eslint-disable no-underscore-dangle */
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const HttpStatus = require('../../middleware/httpStatus');
const User = require('../models/user');
const logger = require('../../middleware/logger');
const { Http } = require('winston/lib/winston/transports');

const router = express.Router();

const port = process.env.PORT || 5000;
const SALT_ROUNDS = 10;

router
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

  // Login for User
  .post('/login', (req, res) => {
    const { email, password } = req.body;
    User.find({ email: email })
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .json({ message: 'Auth failed' });
        }
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (err) {
            return res
              .status(HttpStatus.UNAUTHORIZED)
              .json({ message: 'Auth failed' });
          }
          if (result) {
            return res
              .status(HttpStatus.OK)
              .json({ message: 'Auth successful' });
          }
          res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Auth failed' });
        });
      })
      .catch((err) => {
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
