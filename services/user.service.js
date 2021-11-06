const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Matric = require("../models/Matrics");
const User = require("../models/User");

const checkMatric = (req, res) => {
  const matric = req.body.matric;
  Matric.findOne({ matric })
    .then((result) => {
      if (!result) {
        res.status(404).json({ success: false, message: "This Matric no is not found" });
        return;
      }

      User.findOne({ matric }).then((reslt) => {
        if (reslt) {
          res.status(403).json({ success: false, message: "Matric No. is Already Registered!" });
          return;
        }

        jwt.sign(
          { id: result._id, matric: result.matric },
          process.env.JWT_SECRET,
          { expiresIn: 3600 },
          (error, token) => {
            if (error) throw error;
            res.status(202).json({ success: true, token, matric });
            return;
          }
        );
      });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(404)
        .json({ success: false, message: "There's an error while handling your request", error });
    });
};

const registerUser = (req, res) => {
  const info = req.body;

  User.findOne({ matric: req.user.matric })
    .then(async (result) => {
      if (result) {
        res.status(403).json({ success: false, message: "User Already Exist!" });
        return;
      }

      // Please Fix Unique Username
      const emailIsReg = await User.findOne({ email: info.email });
      const usernameIsReg = await User.findOne({ email: info.username });
      if (emailIsReg) {
        res.status(400).json({ success: false, message: "Sorry! Email is already used" });
        return;
      }

      if (usernameIsReg) {
        res.status(400).json({ success: false, message: "Sorry! Username is already taken" });
        return;
      }

      info.matric = req.user.matric;
      let newUser = new User(info);

      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(newUser.password, salt, (error, hash) => {
          if (error) {
            res
              .status(500)
              .json({ success: false, message: "Unable to create your account", error });
            return;
          }

          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              //Send Email for verification
              res.status(201).json({
                success: true,
                message:
                  "Account created successfully, please check your email to verify your account",
              });
            })
            .catch((error) => {
              res.status(500).json({
                success: false,
                message: error.message,
                // error,
              });
            });
        })
      );
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "There's an error while handling your request", error });
    });
};

const loginUser = (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, message: "Please, enter all required field" });
    return;
  }
  User.findOne({ email }).then((result) => {
    if (!result) {
      res.status(400).json({ success: false, message: "Invalid or wrong credentials!" });
      return;
    }
    bcrypt.compare(password, result.password).then(async (isMatch) => {
      if (!isMatch)
        return res.status(400).json({ success: false, message: "Invalid or wrong credentials!" });
      try {
        const user = await User.findOne({ email: result.email }).select("-password -__v");
        jwt.sign(
          { id: result.id, usertype: result.usertype },
          process.env.JWT_SECRET,
          { expiresIn: 3600 },
          (error, token) => {
            if (error) {
              res.status(401).json({ success: false, message: "Unable to login" });
              return;
            }
            res.status(200).json({ success: true, token, result: user });
          }
        );
      } catch (error) {
        console.log(error);
        res.status(401).json({ success: false, message: "Error!, Unable to login" });
        return;
      }
    });
  });
};

const getAllAccount = (req, res) => {
  User.find({})
    .select("-password -__v")
    .then((result) => {
      res.status(200).json({ success: true, result });
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "There's an error while handling your request", error });
    });
};

const getAnAccount = (req, res) => {
  User.findById(req.params.id)
    .select("-password -__v")
    .then((result) => {
      if (!result) {
        res.status(404).json({ success: false, message: "This account is not found" });
        return;
      }
      res.status(200).json({ success: true, result });
      return;
    })
    .catch((error) =>
      res
        .status(404)
        .json({ success: false, message: "There's an error while handling your request", error })
    );
};

const getAUserForPassword = (req, res) => {
  User.findById(req.user.id)
    .select("firstname lastname email")
    .then((user) => {
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      res.status(200).json({ success: true, result: user });
    })
    .catch((error) =>
      res
        .status(404)
        .json({ success: false, message: "There's an error while handling your request", error })
    );
};

const updateUser = async (req, res) => {
  const newData = req.body;

  if (req.params.id === req.user.id || req.user.usertype == "admin") {
    let final = {};
    for (let key in newData) {
      if (newData[key] !== "") {
        if (key === "usertype") {
          if (req.user.usertype == "user") {
            final[key] = newData[key];
          }
        } else if (key === "matric") {
          // Skip if trying to edit matric no.
        } else {
          final[key] = newData[key];
        }
      }
    }

    try {
      let rslt = await User.findOne({ _id: req.params.id });
      if (!rslt) return res.status(404).json({ success: false, message: "User not found" });
      if (final.password) {
        let salt = await bcrypt.genSalt(10);
        final.password = await bcrypt.hash(final.password, salt);
      }
      let result = await User.updateOne({ _id: rslt._id }, { $set: final });
      res.status(200).json({ success: true, result });
      return;
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Can't update user's data",
        error,
      });
    }
  }

  res.status(401).json({
    success: false,
    message: "You're not authorized to update",
  });
  return;
};

const changeUsersType = (req, res) => {
  var { usertype } = req.body;
  var newUser = {
    usertype,
  };
  if (req.user.usertype !== "admin")
    return res.status(401).json({
      success: false,
      message: "You're not authorized ;(",
    });

  User.findOne({ _id: req.params.id })
    .then((rslt) => {
      if (!rslt) return res.status(404).json({ success: false, message: "User not found" });
      User.updateOne({ _id: rslt._id }, { $set: newUser })
        .then((result) => {
          res.status(200).json({ success: true, result });
        })
        .catch((error) =>
          res.status(500).json({
            success: false,
            message: "Can't update user's data",
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: "Can't update user's data", error })
    );
};

const deleteUser = (req, res) => {
  if (req.user.usertype !== "admin")
    return res.status(501).json({
      success: false,
      message: "You're not authorized",
    });

  User.deleteOne({ _id: req.params.id })
    .then((result) => res.status(200).json({ success: true, result }))
    .catch((error) => res.status(500).json({ success: false, message: "User can't be deleted" }));
};

module.exports = {
  checkMatric,
  registerUser,
  loginUser,
  getAllAccount,
  getAnAccount,
  updateUser,
  deleteUser,
  changeUsersType,
};
