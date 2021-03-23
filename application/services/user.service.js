const { UserModel } = require('../models/user.model')
const { internalServerError } = require('../../helpers/http-exception')
const { hashSync, genSaltSync } = require('bcrypt')

class UserService {

  static async findByEmail(email, selectPassword = false) {
    try {
      selectPassword = selectPassword ? '-password' : ''
      const user = await UserModel.findOne({
        email: email
      }).select(selectPassword)

      return user
    } catch (error) {
      throw error
    }
  }

  static async createUser(user) {
    try {
      user.password = hashSync(user.password, genSaltSync(12))
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
