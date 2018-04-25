var mongoose     = require('mongoose');

var Schema       = mongoose.Schema;

var UrlIDMappingSchema = new Schema({
	shortId : String,
	url : String
});

module.exports = mongoose.model('urlIDMapping', UrlIDMappingSchema);