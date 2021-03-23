require('dotenv').config()
const mongoose = require('mongoose')

class MongoDBModule {
  static connectionConfig() {
    return {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true
    }
  }

  static async connect(config) {
    await mongoose.connect(process.env.MONGODB_URL, config)
    console.log(`mongo connection established`);
  }
}

module.exports = {
  MongoDBModule
}
