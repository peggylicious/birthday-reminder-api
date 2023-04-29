const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const router = express.Router({ mergeParams: true });

router.post('/create', (req, res, next) => {
    let newUser = new User({
    id: new mongoose.Types.ObjectId(),
    user_name: req.body.user_name,
    company_name: req.body.company_name,
    last_reminder_digit: 0
    })
    newUser.save().then(result => {
        res.status(200).json({result})
    }).catch(err => {
        res.status(500).json(err)
    })
})

router.post('/signup', (req, res, next) => {
    // console.log(req.params.role);
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   console.log(errors.array());
    //   return res.status(400).json(errors.array());
    // }
    User.findOne({ email: req.body.email }).then((userfound) => {
      console.log("My user ", userfound);
      if (req.body.email === 'undefined') {
        console.log(req);
        return res.status(500).json({
          message:
            "No data was submitted. Make sure you are using the correct headers / content-type",
        });
      }
      if (userfound !== null) { // If email exists
        console.log("Null of ", userfound);
        return res.status(401).json({ message: "User already exists" });
      }
      bcrypt.hash(req.body.password, 10, function (err, hash) { // Encrypt password
        // if (req.body.password !== req.body.confirmPassword) { // Check for password equality
        //   return res
        //     .status(401)
        //     .json([{ msg: "password do not match", param: "password" }]);
        // }
        // Frontend should also verify that both passwords are same b4 sending to Backend
        const newUser = new User({
          id: new mongoose.Types.ObjectId(),
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          password: hash,
        //   role: req.params.role
        });
        // Store hash in your password DB.
        console.log(userfound, "else");
        return newUser
          .save()
          .then((result) => {
            console.log("new User ", result);
            res.status(200).json({ message: "User created", data: result });
          })
          .catch((err) => {
            res.status(500).json({ err });
          });
      });
    }); 
})

router.post('/login', (req, res, next) => {
 let foundUser;
  const registeredUser = new User({
    email: req.body.email,
    password: req.body.password,
  });

  User.findOne({ email: req.body.email }).then((userExists) => {
    console.log("User is ", userExists);

    if (userExists === null) {
      return res.status(401).json({ message: "User does not exists" });
    }
    console.log(
      "Body Pass ",
      req.body.password,
      " | Db Pass ",
      userExists.password
    );
    let comparePassword = bcrypt.compare(
      req.body.password,
      userExists.password
    );
    foundUser = userExists;
    comparePassword
      .then((passwordIsCorrect) => {
        console.log("Password is correct", passwordIsCorrect);
        if (passwordIsCorrect === false) {
          return res.status(401).json({
            message: "Auth failed 1",
          });
        }
        var token = jwt.sign(
          { email: req.body.email, tid: foundUser._id },
          process.env.HASH, 
          // { expiresIn: '240s' }
        );
        console.log("Token ", token);
        return res.status(200).json({
          message: "Auth successful",
          token: token,
          loggedUserId: foundUser._id,
        });
      })
      .catch((err) => {
        next(err);
      });
  });
})

module.exports = router