const mongoose = require('mongoose')
const schema = mongoose.Schema

const SeventSchema = new schema({
    _id: String,
    name: String,
    description: String,
    date: Date
})

module.exports = mongoose.model('Sevent', SeventSchema, 'Sevent')