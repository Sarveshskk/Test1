const  {body, validationResult} = require('express-validator')
const User = require("../models/users");
const taskStatusValidateRules = () => {
  return [
    body("task_status").not().isEmpty().withMessage('task-name must have value'),
    body("task_status").isIn(['open', 'ready','inreview','completed']).withMessage('status must be open, ready, inreview or completed!')
  ]
}
const taskStatusValidate = (req, res, next) => {
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

module.exports =  {taskStatusValidateRules,taskStatusValidate}