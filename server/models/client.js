const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = new Schema({
  // _id: { type: Schema.Types.ObjectId, default: () => new Schema.Types.ObjectId() },
  trainer: { type: Schema.Types.ObjectId, ref: 'User' },
  firstName: String,
  lastName: String,
  birthDate: Date,
  address: String,
  notes: String,
  privateHealth: Boolean
})

module.exports = mongoose.model('Client', ClientSchema)
