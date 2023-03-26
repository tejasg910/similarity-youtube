const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/pizza");
    console.log("database connected succesfully");
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = connectDB;
