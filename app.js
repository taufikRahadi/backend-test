/**
 * Dependencies
 */
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const responseFormatter = require('./helpers/response-formatter')
const { MongoDBModule } = require('./config/mongo.config')

/**
 * instantiate express app
 */
const app = express()

/**
 * import all the routes
 */
const authRoutes = require('./application/routes/auth.route')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

console.log(`connecting to mongo db server`)
MongoDBModule.connect(MongoDBModule.connectionConfig())

app.use('/api/v1/auth', authRoutes)
/**
 * throw an error 404 if routes not found
 */
app.use('*', (req, res) => {
  res
    .status(404)
    .json(
      responseFormatter(
        false,
        `Not found`,
      )
    )
})

module.exports = app
