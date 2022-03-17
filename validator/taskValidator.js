const  {body, validationResult} = require('express-validator')
const User = require("../models/users");
const taskValidateRules = () => {
  return [
    body("task_name").not().isEmpty().withMessage('task-name must have value'),
  ]
}
const taskValidate = (req, res, next) => {
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

module.exports =  {taskValidateRules,taskValidate}