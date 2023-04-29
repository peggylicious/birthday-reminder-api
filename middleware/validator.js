const express = require("express");

const { body, validationResult, check } = require("express-validator");
module.exports.check = [
  check([
    // "created_at",
    // "created_by",
    // "date",
    // "time"
    // "payment_due",
    // "description",
    // "payment_terms",
    // "status",
    // "total",
    // "client_name",
    // "client_email",
    // "senderAddress['street']",
    // "senderAddress['city']",
    // "senderAddress.postCode", 
    // "senderAddress.country",
    // "clientAddress.street", 
    // "clientAddress.city",
    // "clientAddress.postCode", 
    // "clientAddress.country"
  ])
    .not()
    .isEmpty()
    .withMessage("The field is empty"),
    // check("client_email").isEmail().withMessage("Not an email"),
  // check('client_name').isLength({ min: 5 }).withMessage('The username at least more than 5 characters!'),
  //   check("client_email")
  //     .isEmail()
  //     .withMessage("Is your email correct? Please be correct!"),
];



// check("created_at").not().isEmpty().withMessage("The field is empty"),
//   check("created_by").not().isEmpty().withMessage("The field is empty"),
//   check("payment_due").not().isEmpty().withMessage("The field is empty"),
//   check("description").not().isEmpty().withMessage("The field is empty"),
//   check("payment_terms").not().isEmpty().withMessage("The field is empty"),
//   check("status").not().isEmpty().withMessage("The field is empty"),
//   check("total").not().isEmpty().withMessage("The field is empty"),
//   check("client_name").not().isEmpty().withMessage("The field is empty"),
//   check("client_email").not().isEmpty().withMessage("The field is empty"),
// (req, res, next) => {
//   // console.log("REQ")

//       // username must be an email
//       // console.log(check('client_name').isEmpty().withMessage("Wrong"))

//   const errors = validationResult(req);
//   console.log("Hi", errors)
//   if (!errors.isEmpty()) {
//     console.log(errors.array());
//     return res.status(400).json(errors.array());
//   }
//   // password must be at least 5 chars long
//   // body('password').isLength({ min: 5 })
//   next()
// }

// module.exports = bodyValidator
