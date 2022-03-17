const  {body, validationResult} = require('express-validator')
const User = require("../models/users");
const rateValidateRules = () => {
  return [
    body("user_id").not().isEmpty().withMessage('user-id must have value'),
    body("task_id").not().isEmpty().withMessage('task-id must have value'),
    body("task_rating").isInt({min:1,max:10}).withMessage("Type rating from 1 to 10."),
  ]
}
const rateValidate = (req, res, next) => {
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

module.exports =  {rateValidateRules,rateValidate}