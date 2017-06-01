var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlSchema = new Schema({
  originalUrl: String,
  shorterUrl: String
}, {timestamp: true});

var ModelClass = mongoose.model('url', urlSchema);

module.exports = ModelClass;
