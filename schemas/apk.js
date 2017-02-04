var mongoose = require('mongoose')
var ApkSchema = new mongoose.Schema({
  title: String,
  doctor: String,
  language: String,
  country: String,
  year: Number,
  summary: String,
  flash: String,
  poster: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

ApkSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now();
  }
  next()
})
ApkSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort({
        'meta.updateAt': -1
      })
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({
        _id: id
      })
      .exec(cb)
  }
}

module.exports = ApkSchema
