const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    try {
        mongoose.connect(process.env.dbURL);
        console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
    process.on('unhandledRejection', error => {
        console.log('unhandledRejection', error.message);
    });
};
module.exports = dbConnect;
