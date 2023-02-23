const express = require('express');
const pageRoute = require('./routes/pageRoute')
const app = express();

const port = 3000;

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(express.static('public'));

app.use('/', pageRoute );

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
