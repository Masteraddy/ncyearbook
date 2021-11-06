require("dotenv").config();
const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
};

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, options)
    .then(() => console.log("DB Connected"))
    .catch((error) => console.log(error));
};

module.exports = connectDB;
