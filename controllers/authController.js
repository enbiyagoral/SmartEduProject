const bcrypt = require('bcrypt');
const Category = require('../models/Category');
const User = require('../models/User');
const Course = require('../models/Course');
const { validationResult } = require('express-validator');
const { clearCache } = require('ejs');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    const errors = validationResult(req);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', ` ${errors.array()[i].msg}`);
    }
    res.status(400).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = null;
    user = await User.findOne({ email: email });
    let same = await bcrypt.compare(password, user.password);

    if (same) {
      req.session.userID = user._id;
      res.status(200).redirect('/users/dashboard');
    } else {
      req.flash('error', 'Your password is not correct!');
      res.status(400).redirect('/login');
    }
  } catch (error) {}
};

exports.logoutUser = async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    'courses'
  );
  const courses = await Course.find({ user: req.session.userID });
  const categories = await Category.find();
  const users = await User.find();
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
    users,
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    const course = await Course.deleteMany({ user: req.params.id }); // user yerine dikkat
    res.status(201).redirect('/users/dashboard');
  } catch (error) {
    const errors = validationResult(req);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', ` ${errors.array()[i].msg}`);
    }
    res.status(400).redirect('/register');
  }
};
