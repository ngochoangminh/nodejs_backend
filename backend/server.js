const express = require('express');
const app = require('./app')
const connectDB = require('./configs/db');
require('dotenv').config();
connectDB();
PORT = process.env.PORT || 5000;

app.listen(
  PORT, () => console.log(`server is listening on port:http://localhost:${PORT}`)
);

//  npx nodemon backend/server.js