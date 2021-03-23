const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    required: true
  }
}, {
  timestamps: true,
  validateBeforeSave: true
})

const UserModel = mongoose.model('user', UserSchema)

module.exports = {
  UserModel
}
