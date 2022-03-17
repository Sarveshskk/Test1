const  {body, validationResult} = require('express-validator')
const User = require("../models/users");
const addressValidateRules = () => {
  return [
    body("address").not().isEmpty().withMessage('address must have value'),
    body('city').not().isEmpty().withMessage('city must have value'),
    body('state').not().isEmpty().withMessage('state must have value'),
    body('pin_code').not().isEmpty().withMessage('pin_code must have value'),
    body("pin_code").matches(/^\d{6}$/).withMessage("pin_code must have 6 digit"),
    body('phone_no').not().isEmpty().withMessage('phone_n0 must have value'),
    body("phone_no").matches(/^\d{10}$/).withMessage("phone_no must have 10 digit"),
    
  ]
}
const addressValidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports =  {addressValidateRules,addressValidate}