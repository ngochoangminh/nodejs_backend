// conn = Mongo("mongodb://<username>:<password>@localhost:27017/<authDB>");
// var db_url =  'mongodb://localhost:27017/mydb';
var mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
var db_url = process.env.MONGODB_CLOUD;

const connectDB = async () =>  {
    try {
        await mongoose.connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.log(error);
        console.error("MongoDB connection FAIL");
        process.exit(1);
    }
};
module.exports = connectDB;