const responseFormatter = require('./response-formatter')

const internalServerError = (res, message = 'there is an error with our system, please try again later.', data = {}) => {
  res.status(500).json(responseFormatter(false, message, data))
}

const notFoundError = (res, message = 'data not found', data = {}) => {
  res.status(404).json(responseFormatter(false, message, data))
}

const checkValidationError = (res, error) => {
  if (error)
    res.status(400)
    .json(
      responseFormatter(
        false, error.message, error
      )
    ) 
}

module.exports = {
  internalServerError, checkValidationError, notFoundError
}
