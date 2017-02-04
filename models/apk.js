var mongoose = require('mongoose')
var appSchema = require('../schemas/apk.js')
var app = mongoose.model('app', appSchema)

module.exports = app
