const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const reminder = require("../models/reminder")
const user = require("../models/user");
const reminderNo = require("../module/reminderNo")

const { body, validationResult } = require("express-validator");

module.exports.createReminder = (req, res, next) => {
  // reminder.find(reminder_id: req.body.reminder_id)
  const newreminder = new reminder({
    id: new mongoose.Types.ObjectId(),
    reminder_id: "", // String is shorthand for {type: String}
    created_at: req.body.created_at,
    // created_by: req.body.created_by,
    date: req.body.date,
    time: req.body.time
    // payment_due: req.body.payment_due,
    // description: req.body.description,
    // payment_terms: req.body.payment_terms,
    // client_name: req.body.client_name,
    // client_email: req.body.client_email,
    // status: req.body.status,
    // senderAddress: {
    //   street: req.body.senderAddress.street,
    //   city: req.body.senderAddress.city,
    //   postCode: req.body.senderAddress.post_code,
    //   country: req.body.senderAddress.country,
    // },
    // clientAddress: {
    //   street: req.body.clientAddress.street,
    //   city: req.body.clientAddress.city,
    //   postCode: req.body.clientAddress.post_code,
    //   country: req.body.clientAddress.country,
    // },
    // items: [],
    // total: req.body.total,
  });
  const errors = validationResult(req);
  console.log("Hi", )
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json(errors.array());
  }
  user.findOne({ user_name: req.body.user_name }).then((result) => {
    let newValue = result.last_reminder_digit;
    console.log("last digit ", newValue);
    if (typeof newValue === "undefined") {
      console.log("Undefined value ", newValue);
      newValue = 0;
    }
    // console.log("found user", result);
    // newValue = result.last_reminder_digit++;
    newreminder.reminder_id = reminderNo(newValue++);
    // newreminder.items.push(...req.body.items); //Copy list items from req.body.items into new "items" list in mongoose
    user.last_reminder_digit = newValue; //Create reminder serialized number
    newreminder
      .save()
      .then((result_0) => {
        console.log("Saved reminder");

        return user.updateOne(
          { user_name: req.body.user_name },
          { last_reminder_digit: newValue++ }
        );
      })
      .then((x) => {
        console.log(x);
        console.log("Updated user");
        res.status(200).json(x);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
};

module.exports.getAllReminders = (req, res, next) => {
  reminder
    .find({ created_by: mongoose.Types.ObjectId(req.userId) }) //UserId is gotten from middleware
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
module.exports.deleteReminder = (req, res, next) => {
  reminder
    .deleteOne({ reminder_id: req.params.reminder_id })
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
module.exports.updateReminder = (req, res, next) => {
  reminder
    .find({ reminder_id: req.params.reminder_id })
    .then((result) => {
      let modifiedItems = req.body;
      let reminderItemKeys = Object.keys(result[0].toObject());
      reminderItemKeys.filter((element, index) => {
        // Looks for items to be modified
        if (modifiedItems.hasOwnProperty(element)) {
          // If property exists both in request.body and document
          result[0][element] = modifiedItems[element];
        }
      });
      return result[0].save();
    })
    .then((x) => {
      res.status(200).json(x);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
