const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const cookiesPaser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookiesPaser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.urlencoded({extended:true}));

// import router 
const customerRT = require('./router/user_Router.js');

// Authen
app.use('/api/auth', customerRT); // localhost:{$PORT}/api/customer/register

app.get('/', (request, response) => {
    // The string we want to display on http://localhost:3000
    console.log("This is '/' site!")
    response.send('Welcome on the firt API with nodejs express and mongodb! \n Take a breath and start using it!')
  });

module.exports = app;
