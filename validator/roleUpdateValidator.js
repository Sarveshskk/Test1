const  {body, validationResult} = require('express-validator')
const User = require("../models/users");
const roleValidateRules = () => {
  return [
    body("role").isIn(['admin', 'manager','user']).withMessage('role must be admin,manager or user.'),
  ]
}
const roleValidate = (req, res, next) => {
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

module.exports =  {roleValidateRules,roleValidate}