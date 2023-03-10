const nodemailer = require('nodemailer');
const User = require('../models/User');
const Course = require('../models/Course');

exports.getIndexPage = async (req, res) => {
  const courses = await Course.find().sort('-createdAt').limit(2);
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalTeachers = await User.countDocuments({ role: 'teacher' });
  const totalCourses = await Course.countDocuments();

  res.status(200).render('index', {
    page_name: 'index',
    courses,
    totalStudents,
    totalCourses,
    totalTeachers,
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render('about', {
    page_name: 'about',
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render('register', {
    page_name: 'register',
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render('login', {
    page_name: 'login', //  navigation barı hazırla // page route'a logini ekle //
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render('contact', {
    page_name: 'contact', //  navigation barı hazırla // page route'a logini ekle //
  });
};

exports.sendMail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'unique83@ethereal.email',
        pass: 'uSW7FH9SuyQMXNgygx',
      },
    });

    const outputMessage = `
  <h1> Mail Details </h1>
  <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
  </ul>
  <h1> Messages </h1>
  <p> ${req.body.message} </p>


  `;

    let info = await transporter.sendMail({
      from: `"Fred Foo 👻" <${req.body.email}>`, // sender address
      to: 'unique83@ethereal.email, unique83@ethereal.email', // list of receivers
      subject: 'Hello ✔', // Subject line
      html: outputMessage, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL:

    req.flash('success', 'We Received your message succesfully');
    res.status(200).redirect('/contact');
  } catch (error) {
    req.flash('error', `Something happened!`);
    res.status(200).redirect('/contact');
  }
};
