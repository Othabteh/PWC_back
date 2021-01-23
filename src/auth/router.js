'use strict';
const express = require('express');
const router = express.Router();
const users = require('./models/users-model');
const blogs = require('./models/blogs');

const basicAuth = require('./middlewares/basic');
const checkToken = require('./middlewares/checkToken');

const cookieParser = require('cookie-parser');
router.use(cookieParser());

router.post('/signup', signupHandler);
router.post('/signin', basicAuth, signinHandler);

router.post('/submit', checkToken, async (req, res, next) => {
  try {
    const result = await blogs.submitBlog(req.user, req.body);

    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.patch('/blog/:id', checkToken, async (req, res, next) => {
  console.log('params', req.params);
  console.log('reeeeeeeq', req.user);
  console.log('body', req.body);
  try {
    await blogs.updateBlog(req.user, req.params.id, req.body);
    res.status(201).json('Updated post');
  } catch (err) {
    next(`Can't update post`);
  }
});

router.get('/post/:id', async (req, res, next) => {
  console.log('params', req.params);

  try {
    const result = await blogs.getBlog(req.params.id);
    res.status(201).json(result);
  } catch (err) {
    next(`Can't update post`);
  }
});

router.get('/posts', async (req, res, next) => {
  try {
    const result = await blogs.getBlogs();
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    next(`Can't find post`);
  }
});

router.post('/comment/:id', checkToken, async (req, res, next) => {
  try {
    const result = await blogs.addComment(req.user, req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next('not allowed');
  }
});

router.get('/comment/:id', async (req, res, next) => {
  try {
    const result = await blogs.getComments(req.params.id);
    res.status(201).json(result);
  } catch (err) {
    next('not allowed');
  }
});
function signinHandler(req, res) {
  res.status(202).cookie('token', req.token).json({ token: req.token, user: req.user });
}

function signupHandler(req, res) {
  users.save(req.body).then(async (user) => {
    const token = await users.generateToken(user, '15min');
    res.status(201).json({ token, user });
  });
}

module.exports = router;
