const bcrypt = require('bcrypt');
const Category = require('../models/Category');
const User = require('../models/User');
const Course = require('../models/Course');


exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    let same = await bcrypt.compare(password, user.password)    
    if(same){
      req.session.userID = user._id;
      res.status(200).redirect('/users/dashboard');
    };  
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.logoutUser = async (req, res) => {
    req.session.destroy(()=>{
      res.redirect('/');
    })
};

exports.getDashboardPage = async(req, res) => {
  const user = await User.findOne({_id:req.session.userID}).populate('courses');
  const courses = await Course.find({user:req.session.userID});
  const categories = await Category.find();
  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
  });
};