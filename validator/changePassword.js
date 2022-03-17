const { body, validationResult } = require('express-validator')
const changePasswordValidateRules = () => {
  return [
    body("password").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage('password must have 8 character, Upper case, Lower case, and one special character'),
    body('password').custom((value, { req }) => {
        if (value !== req.body.cnfpassword) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })

    
  ]
}
const changePasswordValidate = (req, res, next) => {
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

module.exports = {
  changePasswordValidateRules,
  changePasswordValidate,
}