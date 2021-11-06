const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    middlename: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    matric: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    dateofbirth: { type: Date, required: true },
    password: { type: String, required: true },
    usertype: { type: String, enum: ["admin", "user"], default: "user" },
    about: { type: String },
    location: { type: String },
    picture: { type: String },
  },
  { timestamps: true }
);

// UserSchema.pre("save", async (next) => {
//   if (!this.isModified("password")) {
//     next();
//   }

//   console.log(this);
//   let salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User", UserSchema);

module.exports = User;
