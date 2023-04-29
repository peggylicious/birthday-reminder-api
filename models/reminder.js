const mongoose = require("mongoose");
const { Schema } = mongoose;
const moment = require('moment');
const cfg = require('../config');
const Twilio = require('twilio');
const reminderSchema = mongoose.Schema({
  // reminder_id: String, // String is shorthand for {type: String}
  // created_at: String,
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  // date: String,
  // time: String
  name: String,
  phoneNumber: String,
  notification: Number,
  timeZone: String,
  time: {type: Date, index: true},
  recepient: String
});

reminderSchema.methods.requiresNotification = function(date) {
  return Math.round(moment.duration(moment(this.time).tz(this.timeZone).utc()
                          .diff(moment(date).utc())
                        ).asMinutes()) === this.notification;
};

reminderSchema.statics.sendNotifications = function(callback) {
  // now
  const searchDate = new Date();
  mongoose.model("reminder", reminderSchema)
    .find()
    .then(function(appointments) {
      console.log(appointments)
      appointments = appointments.filter(function(appointment) {
              return appointment.requiresNotification(searchDate);
      });
      if (appointments.length > 0) {
        sendNotifications(appointments);
      }
    });

    /**
    * Send messages to all appoinment owners via Twilio
    * @param {array} appointments List of appointments.
    */
    function sendNotifications(appointments) {
        const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
        appointments.forEach(function(appointment) {
            // Create options to send the message
            const options = {
                to: `+ ${appointment.phoneNumber}`,
                from: cfg.twilioPhoneNumber,
                /* eslint-disable max-len */
                body: `Hi ${appointment.name}. Just a reminder that today is ${appointment.recepient}' birthday. Don't forget to call`,
                /* eslint-enable max-len */
            };

            // Send the message!
            client.messages.create(options, function(err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = appointment.phoneNumber.substr(0,
                        appointment.phoneNumber.length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                }
            });
        });

        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
          callback.call();
        }
    }
};

module.exports = mongoose.model("reminder", reminderSchema);
