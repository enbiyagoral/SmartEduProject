const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();

mongoose.connect('mongodb+srv://menbiyagoral:wBR7Q0DNVDbRXOey@cluster0.eyvujso.mongodb.net/?retryWrites=true&w=majority').then(() => {
  console.log('DB Connected Successfuly!');
});

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// GLOBAL VARIABLE
global.userIN = null;

// MIDDLEWARES
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'my_keyboard_cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://menbiyagoral:wBR7Q0DNVDbRXOey@cluster0.eyvujso.mongodb.net/?retryWrites=true&w=majority' }),
  })
);

app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});

app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
