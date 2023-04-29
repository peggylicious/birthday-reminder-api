const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = mongoose.Schema({
  user_name: String,
  email: String,
  password: String,
  deleted_reminder_id: Array,
//   items: [],
  last_reminder_digit: Number,
  company_name: String,
});

module.exports = mongoose.model("User", userSchema);