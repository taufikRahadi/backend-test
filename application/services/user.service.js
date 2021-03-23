const { UserModel } = require('../models/user.model')
const { internalServerError } = require('../../helpers/http-exception')
const { hashSync, genSaltSync } = require('bcrypt')

class UserService {

  /**
   * 
   * @param {string} email 
   * @param {boolean} selectPassword set to true if you need to get user password. ex: sign in
   * 
   * find user by their email
   */
  static async findByEmail(email, selectPassword = false) {
    try {
      selectPassword = selectPassword ? '-password' : '' // check if selectPassword true then include the password
      const user = await UserModel.findOne({
        email: email
      }).select(selectPassword)

      return user
    } catch (error) {
      throw error
    }
  }

  /**
   * 
   * @param {UserSchema} user 
   * 
   * create user with hashed password with bcrypt
   */
  static async createUser(user) {
    try {
      user.password = hashSync(user.password, genSaltSync(12)) // hash password
      const newUser = await new UserModel({
        ...user
      }).save()

      return newUser
    } catch (error) {
      throw error
    }
  }

}

module.exports = UserService
