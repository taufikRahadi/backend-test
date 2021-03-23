require('dotenv').config()
const UserService = require('../services/user.service')
const { registerRequestValidation, signInRequestValidation } = require('../../helpers/request-validation')
const { internalServerError, checkValidationError, notFoundError } = require('../../helpers/http-exception')
const responseFormatter = require('../../helpers/response-formatter')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class AuthenticationController {

  /**
   * 
   * @param {*} req 
   * @param {*} res 
   */
  static async signIn(req, res) {
    const { body: { data } } = req // destruct request body to get the data object

    // validate request body
    const { error } = signInRequestValidation(data)
    checkValidationError(error)

    try {
      const findUser = await UserService.findByEmail(data.email) // find user by email from user service
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
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
        data: data.email
      }, process.env.JWT_SECRET)
      const refreshToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60) * 24, // 24 hour
        data: data.email
      }, `${process.env.JWT_SECRET}-refresh`)

      res.json(responseFormatter(true, 'successfully signed in', { accessToken, refreshToken }))

    } catch (error) {
      internalServerError(res, error.message, error)
    }

  }

  static async refreshSession(req, res) {
    const { body: { data: { refreshToken } } } = req

    try {
      const verifyToken = jwt.verify(refreshToken, `${process.env.JWT_SECRET}-refresh`)
      const { data } = jwt.decode(refreshToken)

      const newAccessToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
        data: data
      }, process.env.JWT_SECRET)

      const newRefreshToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60) * 24, // 24 hour
        data: data
      }, `${process.env.JWT_SECRET}-refresh`)

      res.json(responseFormatter(true, 'session updated', { accessToken: newAccessToken, refreshToken: newRefreshToken }))
    } catch (error) {
      res.status(401).json(responseFormatter(false, error.message))
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
