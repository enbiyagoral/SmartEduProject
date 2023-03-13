const bcrypt = require('bcrypt');
const Category = require('../models/Category');
const User = require('../models/User');
const Course = require('../models/Course');
const {validationResult} = require('express-validator');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (error) {
    const errors = validationResult(req);
    for(let i=0; i<errors.array().length;i++){
      req.flash("error", ` ${errors.array()[i].msg}`);
    }
    res.status(400).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user  = null;
    console.log(user);
    user = await User.findOne({ email: email });
    console.log(user);
    let same = await bcrypt.compare(password, user.password)   
    if(!user){
      req.flash("error","User is not exists!");
      res.status(400).redirect('/login');
    }

    if(same){
        req.session.userID = user._id;
        res.status(200).redirect('/users/dashboard');
    }else{
        req.flash("error","Your password is not correct!");
        res.status(400).redirect('/login');
      }
      
  } catch (error) {
    
    
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