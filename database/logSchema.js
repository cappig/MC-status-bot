const mongoose = require('mongoose')
const Schema = mongoose.Schema

const logSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    logs: [
      {
        timestamp: {
          type: Date,
          default: Date.now
        },
        online: {
          required: true,
          type: Boolean
        },
        playersOnline: {
          type: Number
        },
        playerNamesOnline: {
          type: String
        }
      }
    ]
  },
  {
    versionKey: false,
    _id: false
  }
)

const Log = mongoose.model('Log', logSchema)
module.exports = Log
