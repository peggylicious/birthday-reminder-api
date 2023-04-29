const express = require("express");
const mongoose = require("mongoose");
// const reminder = require("../models/reminder");
// const user = require("../models/user");
// const reminderNo = require("../module/reminderNo")

const router = express.Router({ mergeParams: true });
const isLoggedIn = require("../middleware/isLoggedIn");
// const reminder = require("../controllers/reminder");
const reminder = require("../controllers/reminder_twillio");
const { body, validationResult, check } = require("express-validator");
const isValid = require("../middleware/validator")
router.post(
  "/create",
  isValid.check,
  // check(['client_name', "client_email"]).isLength({min: 1 , max: 50}).withMessage("Wrong").withMessage("Empty value"),
  reminder.createReminder
);

router.get("/all", isLoggedIn, reminder.getAllReminders);
router.delete("/delete/:reminder_id", reminder.deleteReminder);
router.delete("/delete/all", reminder.deleteReminderByProperty);
router.put("/update/:reminder_id", reminder.updateReminder);
router.put("/update/:reminder_id", reminder.updateReminder);

module.exports = router;
