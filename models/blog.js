const mongoose = require('mongoose')

const schema = mongoose.Schema

const blogSchema = new schema({
    title: String,
    publishdate: Date,
    excert: String,
    image: String,
    author: String


})

module.exports = mongoose.model('blog', blogSchema, 'blogs')