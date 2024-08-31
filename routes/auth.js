const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const session = require('express-session');

// Configure session
router.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true
}));

// Login page
router.get('/login', (req, res) => {
  res.render('login');
});

// Login POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.userId = user._id;
    res.cookie('SESSION', req.session.id);
    res.redirect('/');
  } else {
    res.render('login', { error: 'Email or Password are incorrect' });
  }
});

// Logout POST
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('SESSION');
  res.redirect('/');
});

module.exports = router;
