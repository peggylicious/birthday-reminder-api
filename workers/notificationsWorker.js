'use strict';

const Appointment = require('../models/appointment');
const Reminder = require('../models/reminder');

const notificationWorkerFactory = function() {
  return {
    run: function() {
      Reminder.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();
