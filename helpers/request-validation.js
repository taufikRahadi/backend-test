const Joi = require('joi')
const joi = require('joi')

const registerRequestValidation = (data) => {
  const schema = Joi.object({
    firstname: Joi.string()
      .required()
      .min(3)
      .max(10),
    lastname: Joi.string(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(8)
      .max(24),
    passwordConfirmation: Joi.ref('password'),
    gender: Joi.valid('MALE', 'FEMALE', 'OTHER').required()
  })

  return schema.validate(data)
}

const signInRequestValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
  })

  return schema.validate(data)
}

module.exports = {
  registerRequestValidation, signInRequestValidation
}
