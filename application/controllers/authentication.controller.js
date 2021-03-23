require('dotenv').config()
const UserService = require('../services/user.service')
const { registerRequestValidation, signInRequestValidation } = require('../../helpers/request-validation')
const { internalServerError, checkValidationError, notFoundError } = require('../../helpers/http-exception')
const responseFormatter = require('../../helpers/response-formatter')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class AuthenticationController {

  static async signIn(req, res) {
    const { body: { data } } = req

    const { error } = signInRequestValidation(data)
    checkValidationError(error)

    try {
      const findUser = await UserService.findByEmail(data.email)
      if (!findUser) notFoundError(res, `user with email ${data.email} was not found`)

      const comparePassword = bcrypt.compareSync(data.password, findUser.password)
      if (!comparePassword) 
        res.status(400)
          .json(
            responseFormatter(
              false, 'wrong password'
            )
          )

      const accessToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60),
        data: data.email
      }, process.env.JWT_SECRET)
      const refreshToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60) * 24,
        data: data.email
      }, process.env.JWT_SECRET)

      res.json(responseFormatter(true, 'successfully signed in', { accessToken, refreshToken }))

    } catch (error) {
      internalServerError(res, error.message, error)
    }

  }

  static async register(req, res) {
    const { body: { data } } = req

    const { error } = registerRequestValidation(data)
    checkValidationError(error)

    try {
      const newUser = await UserService.createUser(data)
      res.status(201)
      .json(
        responseFormatter(
          true, 'user successfully registered', newUser
        )
      )
    } catch (error) {
      internalServerError(res, 'register failed', error)
    }
  }

  static async profile(req, res) {
    const { userEmail, user } = req
    res.json(responseFormatter(true, 'user profile', user))
  }

}

module.exports = {
  AuthenticationController
}
