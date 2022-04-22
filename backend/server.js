const express = require('express');
const http =  require('http');
const { options } = require('./app');
const app = require('./app')
const connectDB = require('./configs/db');

require('dotenv').config();
connectDB();

PORT = process.env.PORT || 5000;

app.listen(
  PORT, () => console.log(`server is listening on port:http://localhost:${PORT}`)
  // var options = {
  //   PORT: 5000,
  //   host: localhost,
  // }
  // var req = http.request(options);

);

//  npx nodemon backend/server.js