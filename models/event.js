const mongoose = require('mongoose')

const schema = mongoose.Schema

const eventSchema = new schema({
    _id: String,
    name: String,
    description: String,
    date: Date
})

module.exports = mongoose.model('event', eventSchema, 'events')